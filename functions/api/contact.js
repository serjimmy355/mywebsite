// Cloudflare Worker style handler for /api/contact
// Rename/adjust according to your deployment method. If using Netlify Edge Functions or a standard Worker, adapt export shape.
// IMPORTANT: Set an environment variable TURNSTILE_SECRET_KEY with your Turnstile secret (never commit the real secret).
// This file demonstrates server-side Turnstile verification plus basic field validation.

const BLOCKED_SENDER_DOMAINS = ['thejimross.co.uk'];
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'getnada.com',
  'dispostable.com',
  'maildrop.cc'
];
const ROLE_LOCAL_PARTS = new Set([
  'admin',
  'contact',
  'hello',
  'info',
  'noreply',
  'no-reply',
  'sales',
  'support'
]);
const MIN_FORM_FILL_MS = 3000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_IP_MAX = 8;
const RATE_LIMIT_EMAIL_MAX = 3;
const DNS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function getGlobalMap(key) {
  if (!globalThis[key]) {
    globalThis[key] = new Map();
  }
  return globalThis[key];
}

function checkRateLimit(bucket, key, limit, windowMs) {
  const now = Date.now();
  const map = getGlobalMap('__contactRateLimitStore');
  const mapKey = `${bucket}:${key}`;
  const recent = (map.get(mapKey) || []).filter((ts) => now - ts < windowMs);
  const isLimited = recent.length >= limit;
  recent.push(now);
  map.set(mapKey, recent);

  // Opportunistic cleanup so the in-memory map does not grow forever.
  if (map.size > 1000) {
    for (const [entryKey, timestamps] of map.entries()) {
      const trimmed = timestamps.filter((ts) => now - ts < windowMs);
      if (trimmed.length === 0) {
        map.delete(entryKey);
      } else {
        map.set(entryKey, trimmed);
      }
    }
  }

  return isLimited;
}

function isBlockedOrDisposableDomain(domain) {
  const blocked = [...BLOCKED_SENDER_DOMAINS, ...DISPOSABLE_EMAIL_DOMAINS];
  return blocked.some((badDomain) => domain === badDomain || domain.endsWith(`.${badDomain}`));
}

async function queryDnsRecords(domain, type) {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
  const cache = getGlobalMap('__contactDnsCache');
  const cacheKey = `${domain}:${type}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.ts < DNS_CACHE_TTL_MS) {
    return cached.records;
  }

  try {
    const res = await fetch(url, {
      headers: {
        accept: 'application/dns-json'
      }
    });
    if (!res.ok) return null;
    const json = await res.json();
    const records = Array.isArray(json.Answer) ? json.Answer : [];
    cache.set(cacheKey, { ts: now, records });
    return records;
  } catch (_) {
    return null;
  }
}

async function hasMailRouting(domain) {
  const mx = await queryDnsRecords(domain, 'MX');
  if (mx === null) {
    // DNS unavailable: soft-pass to avoid blocking valid users due to transient lookup failure.
    return true;
  }
  if (mx.some((record) => record.type === 15)) {
    return true;
  }

  // RFC fallback: if no MX, domains may still accept mail via A/AAAA.
  const a = await queryDnsRecords(domain, 'A');
  if (a && a.some((record) => record.type === 1)) {
    return true;
  }
  const aaaa = await queryDnsRecords(domain, 'AAAA');
  if (aaaa && aaaa.some((record) => record.type === 28)) {
    return true;
  }
  return false;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contact') {
      return new Response('Not found', { status: 404 });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let formData;
    try {
      // Expect multipart/form-data or application/x-www-form-urlencoded
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('multipart/form-data')) {
        formData = await request.formData();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await request.text();
        formData = new URLSearchParams(text);
      } else {
        // Fallback try formData() regardless
        formData = await request.formData();
      }
    } catch (err) {
      return new Response(JSON.stringify({ ok:false, error:'invalid-form-data' }), { status:400 });
    }

    const token = formData.get('cf-turnstile-response');
    if (!token) {
      return new Response(JSON.stringify({ ok:false, error:'missing-turnstile-token' }), { status:400 });
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';
    const secret = env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return new Response(JSON.stringify({ ok:false, error:'server-misconfigured', detail:'Missing TURNSTILE_SECRET_KEY' }), { status:500 });
    }

    if (ip && checkRateLimit('ip', ip, RATE_LIMIT_IP_MAX, RATE_LIMIT_WINDOW_MS)) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'rate-limit-ip',
        message: 'Too many requests from this IP. Please try again later.'
      }), { status: 429 });
    }

    // Verify token with Cloudflare
    let verifyJson;
    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip
        }),
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      });
      verifyJson = await verifyRes.json();
    } catch (e) {
      return new Response(JSON.stringify({ ok:false, error:'turnstile-verification-failed', detail:'network-error' }), { status:502 });
    }

    if (!verifyJson.success) {
      return new Response(JSON.stringify({ ok:false, error:'turnstile-failed', codes: verifyJson['error-codes'] }), { status:403 });
    }

    // Extract fields
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const subject = (formData.get('subject') || '').toString().trim() || 'Website Contact';
    const message = (formData.get('message') || '').toString().trim();
    const honeypot = (formData.get('website') || '').toString().trim();
    const startedAtRaw = (formData.get('form_started_at') || '').toString().trim();

    if (honeypot) {
      return new Response(JSON.stringify({ ok:false, error:'spam-detected' }), { status:400 });
    }

    const startedAt = Number.parseInt(startedAtRaw, 10);
    const now = Date.now();
    if (!Number.isFinite(startedAt) || now - startedAt < MIN_FORM_FILL_MS) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'submitted-too-fast',
        message: 'Please take a little more time before submitting the form.'
      }), { status: 400 });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok:false, error:'missing-required-fields' }), { status:400 });
    }

    // Simple email format check (not exhaustive)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ ok:false, error:'invalid-email' }), { status:400 });
    }

    const emailParts = email.toLowerCase().split('@');
    const localPart = emailParts.length === 2 ? emailParts[0] : '';
    const emailDomain = emailParts.length === 2 ? emailParts[1] : '';
    const hasBlockedDomain = isBlockedOrDisposableDomain(emailDomain);

    if (hasBlockedDomain) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'blocked-email-domain',
        message: 'Please use an email address from a different domain.'
      }), { status: 400 });
    }

    if (ROLE_LOCAL_PARTS.has(localPart)) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'role-based-email-not-allowed',
        message: 'Please use a personal email address rather than a generic inbox.'
      }), { status: 400 });
    }

    if (checkRateLimit('email', email.toLowerCase(), RATE_LIMIT_EMAIL_MAX, RATE_LIMIT_WINDOW_MS)) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'rate-limit-email',
        message: 'Too many submissions from this email. Please try again later.'
      }), { status: 429 });
    }

    const hasValidMailRouting = await hasMailRouting(emailDomain);
    if (!hasValidMailRouting) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'email-domain-has-no-mail-routing',
        message: 'Email domain appears invalid. Please use a valid email address.'
      }), { status: 400 });
    }

    // TODO: Replace this placeholder with an email send (e.g., using an Email API) or KV / Durable Object logging
    // For demo we just echo back
    const payload = { name, email, phone, subject, message, ts: new Date().toISOString() };

    return new Response(JSON.stringify({ ok:true, message:'Received', data: payload }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control':'no-store' }
    });
  }
};
