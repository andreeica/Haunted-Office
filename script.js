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

  // Main title hover effect (visual only, без звука)
  mainTitle.addEventListener('mouseenter', () => {
    createParticles(mainTitle.getBoundingClientRect());
    createHalloweenTitleEffect();
  });

  // Floating creatures hover (visual only, без звука)
  const pumpkins = document.querySelectorAll('.floating-element, .pumpkin, .ghost, .bat');
  
  pumpkins.forEach(pumpkin => {
    pumpkin.addEventListener('mouseenter', () => {
      // Add particle effect
      createParticles(pumpkin.getBoundingClientRect());
      
      // Make it jump
      pumpkin.style.transform = 'scale(1.5) rotate(20deg) translateY(-20px)';
      setTimeout(() => {
        pumpkin.style.transform = '';
      }, 300);
    });
  });

  // ===== Presentation mode per team (sequential highlighting) =====
  function presentTeamCards(teamId) {
    const cards = (flyingCards.get(teamId) || []).slice();
    if (!cards.length) return;
    let idx = 0;
    const run = () => {
      const card = cards[idx % cards.length];
      highlightMemberCard(card);
      idx++;
    };
    // run once and then every 2s
    run();
    // store interval on team map for possible cleanup
    const intId = setInterval(run, 2000);
    // attach to team for cleanup when closing
    const section = document.getElementById(teamId);
    if (section) {
      section.setAttribute('data-presentation-int', String(intId));
    }
  }

  // Reveal Teams Button Functionality
  revealButton.addEventListener('click', function() {
    playSoftWhoosh();
    
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
      
      // Get appropriate audio element for theme (use existing <source> fallbacks)
      const audioIdMap = {
        starwars: 'starwars-bg-audio',
        fixiki: 'fixiki-bg-audio',
        matrix: 'matrix-bg-audio',
        mystics: 'mystics-bg-audio',
        infra: 'infra-bg-audio'
      };
      const audio = document.getElementById(audioIdMap[theme]);
      if (audio) {
        audio.volume = 0.35;
        audio.currentTime = 0;
        audio.play().catch(() => {/* silent */});
        currentTeamAudio = audio;
      }
      
      // Visual effect
      this.style.transform = 'scale(1.02)';
      this.style.boxShadow = '0 0 50px currentColor';
      
      // Play theme hover sound
      playThemeHoverSound(theme);
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
      
      // Soft open sound (no beeps)
      playSoftWhoosh();
      
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
      // Start presentation sequence after all cards created
      setTimeout(() => presentTeamCards(teamId), members.length * 180 + 400);
      
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
    
    // Stop presentation timer for the team
    const section = document.getElementById(teamId);
    const intAttr = section ? section.getAttribute('data-presentation-int') : null;
    if (intAttr) {
      clearInterval(Number(intAttr));
      section.removeAttribute('data-presentation-int');
    }

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
    const gridStartY = centerY - cardHeight / 2 - 150; // Поднимаем карточки выше на 150px

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
    
    // Store member info for highlight
    card.memberData = member;
    
    // Trigger explosion animation with member reveal effect
    setTimeout(() => {
      card.style.animation = `cardFlyOut 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
      
      // Highlight this member after reveal
      setTimeout(() => {
        highlightMemberCard(card);
      }, 850 + (cardIndex * 200)); // Stagger highlights
    }, 50);
    
    // After explosion, start floating
    setTimeout(() => {
      const duration = 4 + Math.random() * 3;
      card.dataset.floatDuration = String(duration);
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
    
    // Stop any animations and reset enlarged state
    card.style.animation = '';
    card.style.transition = '';
    card.setAttribute('data-enlarged', 'false');
    card.classList.remove('enlarged');
    card.style.width = '';
    card.style.height = '';
    card.style.minHeight = '';
    
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
    let hasMoved = false;
    let startX, startY, initialX, initialY;
    const DRAG_THRESHOLD = 5; // Минимальное движение для начала drag
    
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
      hasMoved = false;
      card.isDragging = false; // Пока не уверены что это drag
      card.hasMoved = false; // Флаг для клика
      
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      
      const rect = card.getBoundingClientRect();
      initialX = parseFloat(card.style.left) || rect.left;
      initialY = parseFloat(card.style.top) || rect.top;
      
      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
    
    function onMove(e) {
      const touch = e.touches ? e.touches[0] : e;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Если движение достаточно большое - начинаем drag
      if (distance > DRAG_THRESHOLD && !isDragging) {
        isDragging = true;
        card.isDragging = true;
        card.hasMoved = true;
        hasMoved = true;
        
        // cancel enlarge if active
        if (card.getAttribute('data-enlarged') === 'true') {
          card.setAttribute('data-enlarged', 'false');
          card.classList.remove('enlarged');
          card.style.transform = '';
          card.style.width = '';
          card.style.height = '';
          card.style.minHeight = '';
          card.style.boxShadow = '';
          card.style.filter = '';
        }
        // stop any floating animation during drag
        card.style.animation = 'none';
        card.style.zIndex = '10000';
        card.style.transition = 'none'; // Убираем transition при drag
      }
      
      if (isDragging) {
        // Используем правильные координаты (relative to viewport)
        card.style.left = (initialX + dx) + 'px';
        card.style.top = (initialY + dy) + 'px';
      }
    }
    
    function toggleCardEnlarge() {
      const enlarged = card.getAttribute('data-enlarged') === 'true';
      if (!enlarged) {
        card.setAttribute('data-enlarged', 'true');
        card.classList.add('enlarged');
        card.style.transition = 'all 0.4s ease';
        card.style.transform = 'scale(1.6)';
        card.style.width = '350px';
        card.style.height = 'auto';
        card.style.minHeight = '480px';
        card.style.zIndex = '205';
        card.style.boxShadow = '0 0 150px currentColor, 0 0 200px currentColor';
        card.style.filter = 'brightness(1.3)';
        // Stop floating entirely чтобы не тянуло карту
        card.dataset.prevAnimation = card.style.animation || '';
        card.style.animation = 'none';
        // Показываем весь текст
        const roleEl = card.querySelector('.member-role');
        const powerEl = card.querySelector('.member-power');
        if (roleEl) roleEl.style.display = 'block';
        if (powerEl) powerEl.style.display = 'block';
      } else {
        card.setAttribute('data-enlarged', 'false');
        card.classList.remove('enlarged');
        card.style.transform = '';
        card.style.width = '';
        card.style.height = '';
        card.style.minHeight = '';
        card.style.zIndex = '201';
        card.style.boxShadow = '';
        card.style.filter = '';
        // Resume floating
        const d = Number(card.dataset.floatDuration || '5');
        card.style.animation = `cardFloatFree ${d}s ease-in-out infinite`;
      }
    }
    
    function stopDrag() {
      // Если не было движения (это был клик) - увеличиваем карточку
      if (!hasMoved && !isDragging) {
        toggleCardEnlarge();
      }
      
      if (isDragging) {
        isDragging = false;
        card.style.transition = 'all 0.3s ease'; // Возвращаем transition
        
        setTimeout(() => {
          card.isDragging = false;
          card.hasMoved = false; // Сбрасываем флаг
        }, 100);
        
        card.style.zIndex = card.getAttribute('data-enlarged') === 'true' ? '205' : '201';
        
        // Resume floating animation только если карточка не увеличена
        if (card.getAttribute('data-enlarged') !== 'true') {
          const d = Number(card.dataset.floatDuration || '5');
          card.style.animation = `cardFloatFree ${d}s ease-in-out infinite`;
        }
      } else {
        // Если не было drag, сбрасываем флаг сразу
        setTimeout(() => {
          card.hasMoved = false;
        }, 50);
      }
      
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
  }

  // Get theme color
  function getThemeColor(theme) {
    const colors = {
      'starwars': '#ff0000',
      'fixiki': '#0066ff',
      'matrix': '#00ff41',
      'mystics': '#9d4edd',
      'infra': '#ffd700',
      'royal': '#ffd700',
      'alchemy': '#ffaa00',
      'recruiter': '#9d4edd',
      'oracle': '#8b00ff',
      'detective': '#4a5568',
      'exorcist': '#6b46c1',
      'specter': '#1f2937'
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
  playSound(240, 0.08, 'triangle', 0.18);
}

// Soft whoosh used for CTA and box open
function playSoftWhoosh() {
  playSound(140, 0.18, 'sine', 0.18);
  setTimeout(() => playSound(110, 0.18, 'sine', 0.14), 90);
}

function playCardSound() {
  playSound(800, 0.05, 'sine', 0.15);
}

function playBoxOpenSound() {
  playSound(400, 0.3, 'triangle', 0.4);
  setTimeout(() => playSound(600, 0.2, 'sine', 0.3), 100);
}

function playClosingSound() {
  // Убран противный звук закрытия
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

// Halloween Title Effect
function createHalloweenTitleEffect() {
  const titleRect = document.getElementById('main-title').getBoundingClientRect();
  
  // Create floating pumpkins
  for (let i = 0; i < 5; i++) {
    const pumpkin = document.createElement('div');
    pumpkin.textContent = ['🎃', '👻', '🦇', '🧙', '⚰️'][Math.floor(Math.random() * 5)];
    pumpkin.style.position = 'fixed';
    pumpkin.style.left = (titleRect.left + titleRect.width / 2) + 'px';
    pumpkin.style.top = (titleRect.top + titleRect.height / 2) + 'px';
    pumpkin.style.fontSize = '2rem';
    pumpkin.style.pointerEvents = 'none';
    pumpkin.style.zIndex = '9999';
    
    const angle = (Math.PI * 2 * i) / 5;
    const distance = 150;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    pumpkin.style.transition = 'all 1s ease-out';
    document.body.appendChild(pumpkin);
    
    setTimeout(() => {
      pumpkin.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg) scale(0)`;
      pumpkin.style.opacity = '0';
    }, 10);
    
    setTimeout(() => pumpkin.remove(), 1000);
  }
}

  // Play theme hover sound (no beeps fallback)
  function playThemeHoverSound(theme) {
    try {
      const soundMap = {
        'starwars': document.getElementById('starwars-hover-sound'),
        'fixiki': document.getElementById('fixiki-hover-sound'),
        'matrix': document.getElementById('matrix-hover-sound'),
        'mystics': document.getElementById('mystics-hover-sound'),
        'infra': document.getElementById('infra-hover-sound'),
        'royal': null, // Можно добавить hover звук позже
        'alchemy': null,
        'recruiter': null,
        'oracle': null,
        'detective': null,
        'exorcist': null,
        'specter': null
      };
      const audio = soundMap[theme];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.25;
        audio.play().catch(() => {/* no fallback sound */});
      }
    } catch (_) { /* ignore */ }
  }

// Highlight member card with animation
function highlightMemberCard(card) {
  if (!card) return;
  
  // Create highlight effect
  const highlight = document.createElement('div');
  highlight.style.position = 'absolute';
  highlight.style.top = '0';
  highlight.style.left = '0';
  highlight.style.width = '100%';
  highlight.style.height = '100%';
  highlight.style.borderRadius = '20px';
  highlight.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)';
  highlight.style.pointerEvents = 'none';
  highlight.style.animation = 'cardHighlight 1s ease-out';
  highlight.style.zIndex = '10';
  
  card.appendChild(highlight);
  
  // Make card bigger and brighter
  card.style.transform = 'scale(1.1)';
  card.style.filter = 'brightness(1.3)';
  card.style.zIndex = '203';
  card.style.boxShadow = '0 0 100px currentColor, 0 0 200px currentColor';
  
  // No sound on card highlight
  
  // Remove highlight and return to normal
  setTimeout(() => {
    highlight.remove();
    setTimeout(() => {
      card.style.transform = '';
      card.style.filter = '';
      card.style.zIndex = '201';
      card.style.boxShadow = '';
    }, 500);
  }, 1000);
}

// Add hover effect for tower logo
document.addEventListener('DOMContentLoaded', () => {
  const towerLogo = document.querySelector('.team-logo');
  if (towerLogo) {
    towerLogo.addEventListener('mouseenter', () => {
      createHalloweenTitleEffect();
      
      // Make tower pulse
      const tower = document.querySelector('.tower-base');
      if (tower) {
        tower.style.animation = 'towerPulse 0.5s ease-out';
        setTimeout(() => {
          tower.style.animation = 'towerPulse 3s ease-in-out infinite';
        }, 500);
      }
    });
  }
});
