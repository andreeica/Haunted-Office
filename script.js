// Console message
console.log('👻 Welcome to the Haunted Office! The spirits are awakening...');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // Page load animation message
  setTimeout(() => {
    console.log('Haunted Office awakens... 🔮');
  }, 1000);

  // Get the main title for hover sound effect
  const mainTitle = document.getElementById('main-title');
  const subtitle = document.getElementById('subtitle');
  const revealButton = document.getElementById('reveal-button');
  const teamSections = document.querySelectorAll('.team-section');
  
  // Play spooky sound on title hover (using Web Audio API for wind sound)
  mainTitle.addEventListener('mouseenter', function() {
    playSpookySound();
    // Visual effect is already in CSS (green glow)
  });

  // Reveal Teams Button Functionality
  revealButton.addEventListener('click', function() {
    // Hide the button
    revealButton.style.transition = 'opacity 0.5s ease';
    revealButton.style.opacity = '0';
    setTimeout(() => {
      revealButton.style.display = 'none';
    }, 500);

    // Reveal each team section one by one
    let delay = 0;
    teamSections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.remove('hidden');
        section.classList.add('visible');
        
        // Add entry animation per team member
        const memberCards = section.querySelectorAll('.member-card');
        memberCards.forEach((card, cardIndex) => {
          card.style.animationDelay = `${cardIndex * 0.2}s`;
          card.classList.add('fadeInScale');
        });
      }, delay);
      
      delay += 800; // 800ms delay between each team reveal
    });
  });

  // Eyes following mouse cursor
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    updateEyesPosition();
  });

  function updateEyesPosition() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      // Calculate angle from card center to mouse
      const angle = Math.atan2(mouseY - cardCenterY, mouseX - cardCenterX);
      const distance = Math.min(Math.sqrt((mouseX - cardCenterX) ** 2 + (mouseY - cardCenterY) ** 2) / 10, 15);
      
      // Update eyes position within card
      const eyes = card.querySelector('.eyes');
      if (eyes) {
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        eyes.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    });
  }

  // Spooky sound function (wind/ghost sound using Web Audio API)
  function playSpookySound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a low-frequency tone for wind/ghost effect
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      
      // Add a secondary tone for depth
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.type = 'sawtooth';
        oscillator2.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.2);
        
        gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.start();
        oscillator2.stop(audioContext.currentTime + 0.2);
      }, 50);
      
    } catch (error) {
      console.log('Could not play sound:', error);
    }
  }

  // Additional dynamic glow effects for team sections
  teamSections.forEach(section => {
    section.addEventListener('mouseenter', function() {
      this.style.borderColor = '#00ff00';
      this.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
    });
    
    section.addEventListener('mouseleave', function() {
      this.style.borderColor = '#8b00ff';
      this.style.boxShadow = 'none';
    });
  });

  // Get modal elements
  const modal = document.getElementById('pavelModal');
  const closeBtn = document.querySelector('.close');
  const audio = document.getElementById('modalAudio');

  // Random sparkle effect on click
  document.addEventListener('click', function(e) {
    const memberCard = e.target.closest('.member-card');
    if (memberCard) {
      createSparkle(e.clientX, e.clientY);
      
      // Check if this is Pavel Croitor's card
      if (memberCard.getAttribute('data-name') === 'pavel-croitor') {
        const imagePath = memberCard.getAttribute('data-image');
        if (imagePath) {
          // Show modal
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
          
          // Play music
          playAwesomeMusic();
          
          console.log('Opening Pavel\'s modal with image:', imagePath);
        }
      }
    }
  });

  // Close modal when clicking X
  closeBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    stopMusic();
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      stopMusic();
    }
  });

  // Play awesome music using Web Audio API
  let audioContext;
  
  function playAwesomeMusic() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Epic opening chord
      setTimeout(() => playNote(261.63, 0.2, 0.3, 'sine'), 0);      // C4
      setTimeout(() => playNote(329.63, 0.2, 0.3, 'sine'), 0);      // E4
      setTimeout(() => playNote(392.00, 0.2, 0.3, 'sine'), 0);      // G4
      
      // Haunting melody
      setTimeout(() => playNote(523.25, 0.15, 0.5, 'triangle'), 300);
      setTimeout(() => playNote(659.25, 0.15, 0.5, 'triangle'), 700);
      setTimeout(() => playNote(783.99, 0.15, 0.5, 'triangle'), 1000);
      setTimeout(() => playNote(523.25, 0.15, 0.5, 'triangle'), 1300);
      setTimeout(() => playNote(440.00, 0.15, 0.5, 'triangle'), 1600);
      setTimeout(() => playNote(392.00, 0.15, 0.5, 'triangle'), 1900);
      
      // Spooky bass
      setTimeout(() => playNote(130.81, 0.18, 1.0, 'square'), 500);
      setTimeout(() => playNote(98.00, 0.18, 1.0, 'square'), 1000);
      
      // Atmospheric pad
      for (let i = 0; i < 5; i++) {
        setTimeout(() => playNote(220 + i * 20, 0.1, 2.0, 'sine'), 2000 + i * 200);
      }
      
      console.log('🎵 Awesome music playing!');
      
    } catch (error) {
      console.log('Could not play music:', error);
    }
  }

  function playNote(frequency, volume, duration, type) {
    try {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Note error:', error);
    }
  }

  function stopMusic() {
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  }

  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = '#00ff00';
    sparkle.style.boxShadow = '0 0 20px #00ff00';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkle 0.8s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  }

  // Add CSS for sparkle animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkle {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: scale(3) rotate(360deg);
        opacity: 0;
      }
    }
    
    .fadeInScale {
      animation: fadeInScale 0.5s ease-out both;
    }
    
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});

// Continuous bat flapping effect
setInterval(() => {
  const bats = document.querySelectorAll('.bat');
  bats.forEach(bat => {
    bat.style.transform += ' rotate(5deg)';
  });
}, 1000);

// Random green glow pulses on the page
setInterval(() => {
  const randomSection = Math.floor(Math.random() * 5);
  const sections = document.querySelectorAll('.team-section');
  
  if (sections[randomSection]) {
    sections[randomSection].style.transition = 'all 0.3s ease';
    sections[randomSection].style.boxShadow = '0 0 40px rgba(0, 255, 0, 0.3)';
    
    setTimeout(() => {
      sections[randomSection].style.boxShadow = 'none';
    }, 500);
  }
}, 3000);