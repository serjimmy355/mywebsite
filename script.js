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
      "https://open.spotify.com/embed/playlist/37i9dQZEVXbhVV6c0Y5pA2?utm_source=generator&theme=0",
      "https://open.spotify.com/embed/album/1b6IlVlHRzbkcAWIpXaW37?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/6NodalSfbSnzuK9hICEP2U?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/4GRjTvXuCyesQS6MKSUvDb?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/2esxDyu7ge3QhJzCX0HR4E?utm_source=generator&theme=0", "https://open.spotify.com/embed/track/0GYBZv26NyHrL4AAqVmqhb?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/0Y9wwArjVhEGBR9ptMSwvC?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/5cO7wtkaJCY3SiV6g0MKHE?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/5RqRElQANHEUFyIWPt8FEp?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/6i96oOlC1X5vz2XBE5fL3V?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/3q8PS1Zkx3a0Zo6Ld2L1d7?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/29CzEEdPggm0MYOASEYv21?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/33RYRq7Bet2j5Ho4jMBywE?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/6oOFU7EywhY265eUwhvzAu?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/17f45rWtD5IzrdSew0ZvDi?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/7hNOYnWc9s6oh6AYgsHG85?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/24IBCzEJlHBI0ioxlSuSPA?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/5EaEOUs3O1MZRicDMUIuqo?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/2658hFoRWFFfc4RoVF2QUS?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/2VcJQYKgr6n6tQkf2XsfJH?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/5slTcrsJ9B8Q4q8rA135XE?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/3yWw068pxlaTirtN51cXf5?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/1g0KoWXvjtnJbTQYxxmYbv?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/2BZ8KjxTb0pNNKFwQmG1j9?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/1Qb73C8hC76e3R8udyit5I?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/3W6TEVlmaP22E4KvWY9HrS?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/3p7m1Pmg6n3BlpL9Py7IUA?utm_source=generator&theme=0", "https://open.spotify.com/embed/album/5dR8cTk0CUrkPQ1cEDPtmN?utm_source=generator&theme=0",

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
