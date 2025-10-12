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
"https://open.spotify.com/embed/artist/31jvzuB4ikftPQZJwrYfCF?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/00YTqRClk82aMchQQpYMd5?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0exhrQcReCdr11oPbOh22M?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/4NiJW4q9ichVqL1aUsgGAN?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/4iGsihTcyZ80RQFZhC8bf8?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0iMnpaEHXkgMT956CmP1kj?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6XyY86QOPPrYVGvF9ch6wz?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6meTcQ79DrfkIuSLPZkpBg?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0nq64XZMWV1s7XHXIkdH7K?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1qqdO7xMptucPDMopsOdkr?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/22P5BkhcPUCtDGC9laXpDM?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/5Vp7LqcfAtx2U1RfIX8i7r?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6bu7CtcOMWcS0BMq7snHW6?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/7bHTSvk96ULRLZPZr1SoCZ?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1It5FG5hReUrQInrg7Be1Q?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1km0R7wy712AzLkA1WjKET?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1koutXdSFq2PHqtxSWj9tK?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/4rMxZovfLSDjEL9eI2pKo7?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/52qKfVcIV4GS8A8Vay2xtt?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0qqxspZOkbN00bu6DaRIrn?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/29lz7gs8edwnnfuXW4FhMl?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/7If8DXZN7mlGdQkLE2FaMo?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/03jrbNTeSKP9m161juhm0h?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/2TM0qnbJH4QPhGMCdPt7fH?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/45FqwUG4hTT6d39r2HUsUe?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1caBfBEapzw8z2Qz9q0OaQ?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/3jTlKw98Ql1jGRPYqhqHap?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1HOeqtP7tHkKNJNLzQ2tnr?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/3T55D3LMiygE9eSKFpiAye?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/2goF23SQwJH5I0njJ3TnH2?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1kF0gYnHLUJvFuPdoowO02?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6SiyKSeJo6gcsS2NvuAbsl?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/3N8Hy6xQnQv1F1XCiyGQqA?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/5DpkPhxrNNiGAJPY5seREe?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0znuUIjvP0LXEslfaq0Nor?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/37394IP6uhnjIpsawpMu4l?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/38vVrIl7XQVwKEg9lvuygG?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6FBDaR13swtiWwGhX1WQsP?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6MwPCCR936cYfM1dLsGVnl?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0GMwjEjIPIP4188Hyrjm69?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0epOFNiUfyON9EYx7Tpr6V?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/3RNrq3jvMZxD9ZyoOZbQOD?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/3u2R8st1bb6zfBqNWceRXG?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6hFGJROGWu6NDrHk8Xw337?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/0ySofnhaz92JM3LxOLs4lq?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/5BtHciL0e0zOP7prIHn3pP?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/5zJB2KYIylCM6uPtl9R9yp?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/7cImXesjInq0e25gQLHWoV?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/7ptm7G8z8VVvwBnDq8fAmD?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/4NiJW4q9ichVqL1aUsgGAN?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/6SiyKSeJo6gcsS2NvuAbsl?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/4k1ELeJKT1ISyDv8JivPpB?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/3IXtskFMls8KXRipcIJT9y?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1kkyfIopIiVvaPHHlbsfac?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/51J0q8S7W3kIEYHQi3EPqk?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/1Tsag5J854qxeOo2apszug?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/5rJVTTK0ucAxQhkUc0nXbH?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/22P5BkhcPUCtDGC9laXpDM?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/2xiIXseIJcq3nG7C8fHeBj?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/7AsPubxWM5tfW4hTZEL3aP?utm_source=generator&theme=0",
"https://open.spotify.com/embed/artist/49b68DLRK5eCbtJf7Xx4Cc?utm_source=generator&theme=0",


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
