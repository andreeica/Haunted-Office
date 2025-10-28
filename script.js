// 🎃 HAUNTED OFFICE - Main Script 🎃
document.addEventListener('DOMContentLoaded', () => {
  // Audio elements
  const backgroundAudio = document.getElementById('backgroundAudio');
  let currentTeamAudio = null;
  let currentOpenBox = null;
  let flyingCards = new Map(); // Используем Map чтобы хранить карточки по командам
  
  // Page load animation message
  setTimeout(() => {
    console.log('Haunted Office awakens... 🔮');
  }, 1000);

  // Get elements
  const mainTitle = document.getElementById('main-title');
  const subtitle = document.getElementById('subtitle');
  const revealButton = document.getElementById('reveal-button');
  const hideTeamsButton = document.getElementById('hide-teams-button');
  const teamSections = document.querySelectorAll('.team-section');
  const flyingCardsContainer = document.getElementById('flyingCardsContainer');
  
  // Start background music on first interaction
  let musicStarted = false;
  document.body.addEventListener('click', function startMusic() {
    if (!musicStarted && backgroundAudio && backgroundAudio.paused) {
      backgroundAudio.volume = 0.4;
      backgroundAudio.play().catch(e => console.log('Auto-play prevented:', e));
      musicStarted = true;
    }
  }, { once: true });

  // Main title hover effect
  mainTitle.addEventListener('mouseenter', () => {
    playSpookySound();
    createParticles(mainTitle.getBoundingClientRect());
  });

  // Floating pumpkins hover
  const pumpkins = document.querySelectorAll('.floating-element');
  pumpkins.forEach(pumpkin => {
    pumpkin.addEventListener('mouseenter', () => {
      playWitchLaughSound();
    });
  });

  // Reveal Teams Button Functionality
  revealButton.addEventListener('click', function() {
    playExplosionSound();
    
    // Reduce background music volume
    if (backgroundAudio && !backgroundAudio.paused) {
      let volume = backgroundAudio.volume;
      const fadeOut = setInterval(() => {
        if (volume > 0.1) {
          volume -= 0.05;
          backgroundAudio.volume = volume;
        } else {
          clearInterval(fadeOut);
        }
      }, 100);
    }
    
    // Create explosion effect
    createExplosion(this.getBoundingClientRect());
    
    // Hide reveal button and show hide button
    this.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    this.style.opacity = '0';
    this.style.transform = 'scale(0.5)';
    setTimeout(() => {
      this.style.display = 'none';
      if (hideTeamsButton) {
        hideTeamsButton.style.display = 'block';
        hideTeamsButton.style.opacity = '0';
        setTimeout(() => {
          hideTeamsButton.style.transition = 'opacity 0.5s ease';
          hideTeamsButton.style.opacity = '1';
        }, 100);
      }
    }, 500);

    // Reveal each team section one by one
    let delay = 0;
    teamSections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.remove('hidden');
        section.classList.add('visible');
        playRevealSound();
      }, delay);
      
      delay += 600;
    });
  });

  // Hide Teams Button Functionality
  hideTeamsButton.addEventListener('click', function() {
    playClosingSound();
    
    // Close any open box first
    if (currentOpenBox) {
      closeBox(currentOpenBox);
    }
    
    // Hide all team sections
    teamSections.forEach(section => {
      section.classList.remove('visible');
      section.classList.add('hidden');
    });
    
    // Show reveal button and hide hide button
    this.style.transition = 'opacity 0.5s ease';
    this.style.opacity = '0';
    setTimeout(() => {
      this.style.display = 'none';
      revealButton.style.display = 'block';
      revealButton.style.opacity = '0';
      setTimeout(() => {
        revealButton.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        revealButton.style.opacity = '1';
        revealButton.style.transform = 'scale(1)';
      }, 100);
    }, 500);
    
    // Restore background music
    if (backgroundAudio) {
      let volume = backgroundAudio.volume;
      const fadeIn = setInterval(() => {
        if (volume < 0.4) {
          volume += 0.04;
          backgroundAudio.volume = volume;
        } else {
          clearInterval(fadeIn);
        }
      }, 100);
    }
  });

  // Team section hover effects - play theme music
  teamSections.forEach(section => {
    const theme = section.getAttribute('data-theme');
    
    section.addEventListener('mouseenter', function() {
      if (currentTeamAudio) {
        currentTeamAudio.pause();
        currentTeamAudio.currentTime = 0;
      }
      
      // Dim main music more
      if (backgroundAudio && !backgroundAudio.paused) {
        backgroundAudio.volume = 0.05;
      }
      
      // Get appropriate audio for theme
      let audio = null;
      if (theme === 'starwars') {
        audio = document.getElementById('starwars-bg-audio');
      } else if (theme === 'fixiki') {
        audio = document.getElementById('fixiki-bg-audio');
      } else if (theme === 'matrix') {
        audio = document.getElementById('matrix-bg-audio');
      } else if (theme === 'mystics') {
        audio = document.getElementById('mystics-bg-audio');
      } else if (theme === 'infra') {
        audio = document.getElementById('infra-bg-audio');
      }
      
      if (audio) {
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play error:', e));
        currentTeamAudio = audio;
      }
      
      // Visual effect
      this.style.transform = 'scale(1.02)';
      this.style.boxShadow = '0 0 50px currentColor';
    });
    
    section.addEventListener('mouseleave', function() {
      if (currentTeamAudio) {
        currentTeamAudio.pause();
        currentTeamAudio.currentTime = 0;
      }
      
      // Restore main music
      if (backgroundAudio && !backgroundAudio.paused) {
        backgroundAudio.volume = 0.1;
      }
      
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  // Mystery Box Click - Open/Close
  const mysteryBoxes = document.querySelectorAll('.mystery-box');
  
  mysteryBoxes.forEach(box => {
    box.addEventListener('click', function() {
      const isOpen = this.classList.contains('opened');
      
      if (isOpen) {
        // Close this box
        closeBox(this);
      } else {
        // Close any other open box first
        if (currentOpenBox && currentOpenBox !== this) {
          closeBox(currentOpenBox);
        }
        // Open this box
        openBox(this);
      }
    });
  });

  // Open Box and Fly Cards Out
  function openBox(boxElement) {
    const box3d = boxElement.querySelector('.box-3d');
    const membersData = boxElement.getAttribute('data-members');
    
    if (!membersData) return;
    
    try {
      const members = JSON.parse(membersData);
      const theme = boxElement.getAttribute('data-theme');
      const teamId = boxElement.closest('.team-section')?.id || 'unknown';
      
      // Play opening sound
      playBoxOpenSound();
      
      // Mark box as opened
      boxElement.classList.add('opened');
      currentOpenBox = boxElement;
      
      // Get box position on screen
      const boxRect = boxElement.getBoundingClientRect();
      const boxCenterX = boxRect.left + boxRect.width / 2;
      const boxCenterY = boxRect.top + boxRect.height / 2;
      
      // Create explosion particles
      createBoxExplosion(boxRect);
      
      // Initialize array for this team's cards if not exists
      if (!flyingCards.has(teamId)) {
        flyingCards.set(teamId, []);
      }
      
      // Fly cards out
      members.forEach((member, index) => {
        setTimeout(() => {
          createFlyingCard(member, boxCenterX, boxCenterY, theme, teamId);
        }, index * 150);
      });
      
    } catch (error) {
      console.error('Error parsing members data:', error);
    }
  }

  // Close Box and Return Cards
  function closeBox(boxElement) {
    if (!boxElement) return;
    
    playClosingSound();
    
    // Get team ID
    const teamSection = boxElement.closest('.team-section');
    const teamId = teamSection?.id || 'unknown';
    
    // Get box position
    const boxRect = boxElement.getBoundingClientRect();
    const boxCenterX = boxRect.left + boxRect.width / 2;
    const boxCenterY = boxRect.top + boxRect.height / 2;
    
    // Animate only this team's cards back to box
    const teamCards = flyingCards.get(teamId) || [];
    teamCards.forEach((card, index) => {
      setTimeout(() => {
        flyCardBack(card, boxCenterX, boxCenterY, teamId);
      }, index * 100);
    });
    
    // Clear this team's cards from the map
    flyingCards.delete(teamId);
    
    // Close box
    setTimeout(() => {
      boxElement.classList.remove('opened');
      currentOpenBox = null;
    }, teamCards.length * 100 + 500);
  }

  // Create Flying Card
  function createFlyingCard(member, startX, startY, theme, teamId) {
    const card = document.createElement('div');
    card.className = 'flying-card';
    card.style.borderColor = getThemeColor(theme);
    card.style.color = getThemeColor(theme);
    
    // Get scroll position
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate position relative to viewport center (where the box is)
    const centerX = scrollX + viewportWidth / 2;
    const centerY = scrollY + viewportHeight / 2;
    
    // Calculate positions for organized layout (grid)
    const cardsPerRow = 2; // Cards per row
    const cardWidth = 280;
    const cardHeight = 360;
    const spacing = 40;
    
    // Calculate card index in team
    const teamCards = flyingCards.get(teamId) || [];
    const cardIndex = teamCards.length;
    
    // Calculate position in organized grid
    const col = cardIndex % cardsPerRow;
    const row = Math.floor(cardIndex / cardsPerRow);
    
    const gridStartX = centerX - (cardsPerRow * (cardWidth + spacing)) / 2 + spacing;
    const gridStartY = centerY - cardHeight / 2;
    
    const targetX = gridStartX + col * (cardWidth + spacing);
    const targetY = gridStartY + row * (cardHeight + 30);
    
    const rotation = -5 + Math.random() * 10; // Much less rotation
    
    // Calculate distance from box center for animation
    const dx = targetX - centerX;
    const dy = targetY - centerY;
    
    // Set initial position at box center
    card.style.left = targetX + 'px';
    card.style.top = targetY + 'px';
    card.style.setProperty('--start-x', dx + 'px');
    card.style.setProperty('--start-y', dy + 'px');
    card.style.setProperty('--rotation', rotation + 'deg');
    
    // Small floating values for gentle movement
    const floatX = -10 + Math.random() * 20;
    const floatY = -10 + Math.random() * 20;
    card.style.setProperty('--float-x', floatX + 'px');
    card.style.setProperty('--float-y', floatY + 'px');
    
    card.innerHTML = `
      <img src="${member.image}" alt="${member.name}">
      <h3>${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <p class="member-power">"${member.power}"</p>
    `;
    
    // Add to container
    flyingCardsContainer.appendChild(card);
    
    // Add to the team's cards array
    if (!flyingCards.has(teamId)) {
      flyingCards.set(teamId, []);
    }
    flyingCards.get(teamId).push(card);
    
    // Trigger explosion animation
    setTimeout(() => {
      card.style.animation = `cardFlyOut 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
    }, 50);
    
    // After explosion, start floating
    setTimeout(() => {
      const duration = 4 + Math.random() * 3;
      card.style.animation = `cardFloatFree ${duration}s ease-in-out infinite`;
    }, 850);
    
    // Make card draggable
    makeDraggable(card);
    
    // Gentle hover effect instead of pulse
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.zIndex = '202';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.zIndex = '201';
    });
    
    // Click to play sound AND run away from cursor!
    card.addEventListener('click', (e) => {
      if (!card.isDragging) {
        playCardSound();
        
        // Get click position
        const clickX = e.clientX;
        const clickY = e.clientY;
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        // Calculate direction away from click
        const dx = cardCenterX - clickX;
        const dy = cardCenterY - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize and multiply by escape distance
        const escapeDistance = 200 + Math.random() * 150;
        const escapeX = (dx / distance) * escapeDistance;
        const escapeY = (dy / distance) * escapeDistance;
        
        // Calculate new position
        const newX = parseInt(card.style.left) + escapeX;
        const newY = parseInt(card.style.top) + escapeY;
        
        // Keep card within screen bounds
        const finalX = Math.max(20, Math.min(window.innerWidth - cardRect.width - 20, newX));
        const finalY = Math.max(20, Math.min(window.innerHeight - cardRect.height - 20, newY));
        
        // Animate card to new position
        card.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        card.style.left = finalX + 'px';
        card.style.top = finalY + 'px';
        card.style.transform = 'rotate(' + (Math.random() * 30 - 15) + 'deg) scale(1.1)';
        
        // Reset and resume floating after animation
        setTimeout(() => {
          card.style.transition = '';
          const duration = 4 + Math.random() * 3;
          card.style.animation = `cardFloatFree ${duration}s ease-in-out infinite`;
          card.style.transform = '';
        }, 600);
      }
    });
  }

  // Fly Card Back to Box
  function flyCardBack(card, targetX, targetY, teamId) {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    
    const dx = cardCenterX - targetX;
    const dy = cardCenterY - targetY;
    
    card.style.setProperty('--start-x', dx + 'px');
    card.style.setProperty('--start-y', dy + 'px');
    
    // Stop any animations
    card.style.animation = '';
    card.style.transition = '';
    
    // Animate back to box
    card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    card.style.left = targetX - 125 + 'px'; // Center on target
    card.style.top = targetY - 160 + 'px';
    card.style.transform = 'scale(0) rotate(720deg)';
    card.style.opacity = '0';
    
    setTimeout(() => {
      card.remove();
      // Remove from the specific team's cards
      if (flyingCards.has(teamId)) {
        const teamCards = flyingCards.get(teamId);
        const index = teamCards.indexOf(card);
        if (index > -1) {
          teamCards.splice(index, 1);
        }
      }
    }, 600);
  }

  // Make card draggable
  function makeDraggable(card) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
      isDragging = true;
      card.isDragging = true;
      
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      
      const rect = card.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      card.style.animation = 'none';
      card.style.zIndex = '10000';
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
    
    function drag(e) {
      if (!isDragging) return;
      
      const touch = e.touches ? e.touches[0] : e;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      
      card.style.left = (initialX + dx) + 'px';
      card.style.top = (initialY + dy) + 'px';
    }
    
    function stopDrag() {
      if (!isDragging) return;
      
      isDragging = false;
      setTimeout(() => {
        card.isDragging = false;
      }, 100);
      
      card.style.zIndex = '1000';
      
      // Resume floating animation
      const duration = 4 + Math.random() * 3;
      card.style.animation = `cardFloatFree ${duration}s ease-in-out infinite`;
      
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
  }

  // Get theme color
  function getThemeColor(theme) {
    const colors = {
      'starwars': '#ff0000',
      'fixiki': '#0066ff', // Изменили с green на blue
      'matrix': '#00ff41',
      'mystics': '#9d4edd',
      'infra': '#ffd700'
    };
    return colors[theme] || '#ff6600';
  }

  // Random green glow pulses on team sections
  setInterval(() => {
    const visibleSections = Array.from(teamSections).filter(s => s.classList.contains('visible'));
    if (visibleSections.length > 0) {
      const randomSection = visibleSections[Math.floor(Math.random() * visibleSections.length)];
      randomSection.style.transition = 'all 0.3s ease';
      randomSection.style.boxShadow = '0 0 60px rgba(0, 255, 0, 0.5)';
      
      setTimeout(() => {
        randomSection.style.boxShadow = 'none';
      }, 500);
    }
  }, 4000);

  console.log('🎵 Haunted Office initialized!');
});

// ===== PARTICLE EFFECTS =====

function createParticles(rect) {
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = (rect.left + rect.width / 2) + 'px';
    particle.style.top = (rect.top + rect.height / 2) + 'px';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.borderRadius = '50%';
    particle.style.background = `hsl(${Math.random() * 60 + 15}, 100%, 50%)`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    const angle = (Math.PI * 2 * i) / 15;
    const velocity = 100 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.style.transition = 'all 0.6s ease-out';
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.style.transform = `translate(${tx}px, ${ty}px)`;
      particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => particle.remove(), 600);
  }
}

function createExplosion(rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = '50%';
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
    
    const angle = (Math.PI * 2 * i) / 50;
    const velocity = 200 + Math.random() * 200;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.style.transition = 'all 1s ease-out';
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.style.transform = `translate(${tx}px, ${ty}px)`;
      particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => particle.remove(), 1000);
  }
}

function createBoxExplosion(rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.textContent = ['✨', '🌟', '⭐', '💫', '🔮'][Math.floor(Math.random() * 5)];
    particle.style.position = 'fixed';
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.fontSize = '1.5rem';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = 150 + Math.random() * 150;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.style.transition = 'all 1s ease-out';
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`;
      particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => particle.remove(), 1000);
  }
}

// ===== SOUND EFFECTS =====

function playSpookySound() {
  playSound(300, 0.1, 'sine', 0.3);
}

function playExplosionSound() {
  playSound(100, 0.2, 'sawtooth', 0.5);
}

function playRevealSound() {
  playSound(600, 0.1, 'sine', 0.2);
}

function playCardSound() {
  playSound(800, 0.05, 'sine', 0.15);
}

function playBoxOpenSound() {
  playSound(400, 0.3, 'triangle', 0.4);
  setTimeout(() => playSound(600, 0.2, 'sine', 0.3), 100);
}

function playClosingSound() {
  playSound(200, 0.2, 'sawtooth', 0.3);
}

function playWitchLaughSound() {
  playSound(150, 0.15, 'sawtooth', 0.2);
}

function playSound(frequency, duration, type = 'sine', volume = 0.3) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Silent fail if Web Audio API not supported
  }
}
