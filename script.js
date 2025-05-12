// script.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Modal Functionality ---
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('[data-close-modal]');

  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (trigger.tagName === 'A' && trigger.getAttribute('href') === '#') {
        e.preventDefault();
      }
      const modalId = trigger.dataset.modalTarget;
      const modal = document.querySelector(modalId);
      openModal(modal);
    });
  });

  modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      closeModal(activeModal);
    }
  });

  // --- Dropdown Navigation Functionality ---
  const primaryNav = document.querySelector('.primary-navigation');
  const navToggle = document.querySelector('.mobile-nav-toggle');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const visibility = primaryNav.getAttribute('data-visible');

      if (visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
      } else {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
      }
    });

    const navLinks = primaryNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const isMobileView = window.innerWidth <= 768; 
        if (primaryNav.getAttribute('data-visible') === "true" && isMobileView) {
          primaryNav.setAttribute('data-visible', false);
          navToggle.setAttribute('aria-expanded', false);
        }
      });
    });
  }

  // --- Random Spotify Playlist Functionality ---
  // Check if we are on the music page and the spotify-player iframe exists
  const spotifyPlayerIframe = document.getElementById('spotify-player');
  if (spotifyPlayerIframe) {
    const playlistSources = [
      "https://open.spotify.com/embed/playlist/37i9dQZF1E357MpxmOo4Yn?utm_source=generator&theme=0",
      "https://open.spotify.com/embed/playlist/37i9dQZF1E38HhQ5B8y5dJ?utm_source=generator&theme=0",
      "https://open.spotify.com/embed/playlist/37i9dQZF1E356e0z9n6pei?utm_source=generator&theme=0",
      "https://open.spotify.com/embed/playlist/37i9dQZF1E35JCvZJKTt4Y?utm_source=generator&theme=0", 
      "https://open.spotify.com/embed/playlist/37i9dQZF1E36U782OtEBD7?utm_source=generator&theme=0",
      "https://open.spotify.com/embed/playlist/37i9dQZF1E39rrqU2Lbtm3?utm_source=generator&theme=0",
      "https://open.spotify.com/embed/playlist/37i9dQZEVXcQ2i9xozhpgc?utm_source=generator&theme=0",
      "https://open.spotify.com/embed/playlist/37i9dQZEVXbhVV6c0Y5pA2?utm_source=generator&theme=0"
      // Ensure these are the complete and correct embed SRCs from Spotify
    ];

    // Remove duplicates from playlistSources to ensure fair random selection
    const uniquePlaylistSources = [...new Set(playlistSources)];

    if (uniquePlaylistSources.length > 0) {
      const randomIndex = Math.floor(Math.random() * uniquePlaylistSources.length);
      const randomPlaylistSrc = uniquePlaylistSources[randomIndex];
      spotifyPlayerIframe.setAttribute('src', randomPlaylistSrc);
      // You can also set the height here if it varies or if you want to ensure it's 352px
      // spotifyPlayerIframe.setAttribute('height', '352'); 
    } else {
      console.warn("No Spotify playlist sources found for random selection.");
      // Optionally, hide the player or show a message
      // spotifyPlayerIframe.style.display = 'none'; 
      // Or update a paragraph: document.querySelector('#spotify-playlists .page-intro').textContent = "No playlists available at the moment.";
    }
  }
});
