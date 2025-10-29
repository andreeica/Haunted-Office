// 🏠 HOME PAGE - Main Script 🏠
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  const backgroundAudio = document.getElementById('backgroundAudio');
  let musicStarted = false;

  // Try to start music automatically on page load
  const autoStartMusic = () => {
    console.log('🎵 Attempting to start music...', { musicStarted, backgroundAudio: !!backgroundAudio });
    if (!musicStarted && backgroundAudio) {
      backgroundAudio.volume = 0.3;
      backgroundAudio.play()
        .then(() => {
          musicStarted = true;
          console.log('🎵 Music started automatically');
        })
        .catch(err => {
          console.log('Auto-play prevented, waiting for user interaction:', err);
          // If autoplay failed, wait for user interaction
          startMusicOnInteraction();
        });
    } else {
      console.log('🎵 Music not started:', { musicStarted, hasAudio: !!backgroundAudio });
    }
  };

  // Start music on user interaction (fallback if autoplay blocked)
  const startMusicOnInteraction = () => {
    const handler = (e) => {
      if (!musicStarted && backgroundAudio && backgroundAudio.paused) {
        backgroundAudio.volume = 0.3;
        backgroundAudio.play()
          .then(() => {
            musicStarted = true;
            console.log('🎵 Music started on user interaction');
          })
          .catch(err => {
            console.warn('Music play failed:', err);
          });
        // Remove listeners after first play
        document.removeEventListener('click', handler);
        document.removeEventListener('touchstart', handler);
        document.removeEventListener('scroll', handler);
        document.removeEventListener('mousemove', handler);
      }
    };

    // Try multiple events for better compatibility
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    document.addEventListener('scroll', handler, { once: true });
    document.addEventListener('mousemove', handler, { once: true });
  };

  // Try to start music immediately when DOM is ready
  setTimeout(autoStartMusic, 300); // Small delay to ensure audio is loaded

  // Also try when audio can play
  if (backgroundAudio) {
    backgroundAudio.addEventListener('canplay', () => {
      console.log('🎵 Audio can play, attempting to start...');
      if (!musicStarted) {
        setTimeout(autoStartMusic, 100);
      }
    });
    
    backgroundAudio.addEventListener('loadeddata', () => {
      console.log('🎵 Audio data loaded, attempting to start...');
      if (!musicStarted) {
        setTimeout(autoStartMusic, 200);
      }
    });
  }

  // Also try when page is fully loaded
  window.addEventListener('load', () => {
    if (!musicStarted && backgroundAudio && backgroundAudio.paused) {
      setTimeout(autoStartMusic, 100);
    }
  });

  // Handle page visibility for audio management
  document.addEventListener('visibilitychange', () => {
    if (!backgroundAudio) return;
    
    if (document.hidden && !backgroundAudio.paused) {
      backgroundAudio.pause();
    } else if (!document.hidden && musicStarted && backgroundAudio.paused) {
      backgroundAudio.play().catch(() => {});
    }
  });
  // Manual music play button
  const playMusicBtn = document.getElementById('playMusicBtn');
  if (playMusicBtn) {
    playMusicBtn.addEventListener('click', () => {
      if (backgroundAudio) {
        backgroundAudio.volume = 0.3;
        backgroundAudio.play()
          .then(() => {
            musicStarted = true;
            console.log('🎵 Music started manually');
            playMusicBtn.textContent = '🎵 MUSIC PLAYING';
            playMusicBtn.style.opacity = '0.7';
            playMusicBtn.disabled = true;
          })
          .catch(err => {
            console.warn('Manual music play failed:', err);
          });
      }
    });
  }

  console.log('🏠 Home page initialized!');
});


