// Cloudflare Worker style handler for /api/contact
// Rename/adjust according to your deployment method. If using Netlify Edge Functions or a standard Worker, adapt export shape.
// IMPORTANT: Set an environment variable TURNSTILE_SECRET_KEY with your Turnstile secret (never commit the real secret).
// This file demonstrates server-side Turnstile verification plus basic field validation.

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

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok:false, error:'missing-required-fields' }), { status:400 });
    }

    // Simple email format check (not exhaustive)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ ok:false, error:'invalid-email' }), { status:400 });
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
