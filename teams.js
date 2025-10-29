// 👥 TEAMS PAGE - Main Script 👥
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
  const teamSections = document.querySelectorAll('.team-section');
  const flyingCardsContainer = document.getElementById('flyingCardsContainer');
  
  // Track if background music was started (needed for hover logic)
  let musicStarted = false;
  
  // Start background music automatically on page load
  if (backgroundAudio) {

    // Try to start music automatically
    const autoStartMusic = () => {
      console.log('🎵 Attempting to start music on teams page...', { 
        musicStarted, 
        backgroundAudio: !!backgroundAudio, 
        paused: backgroundAudio?.paused 
      });
      if (!musicStarted && backgroundAudio) {
        backgroundAudio.volume = 0.4;
        // Try to play regardless of paused state
        const playPromise = backgroundAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              musicStarted = true;
              console.log('🎵 Music started automatically on teams page');
            })
            .catch(err => {
              console.log('Auto-play prevented, waiting for user interaction:', err);
              // If autoplay failed, wait for user interaction
              startMusicOnInteraction();
            });
        }
      } else {
        console.log('🎵 Music not started:', { musicStarted, hasAudio: !!backgroundAudio });
      }
    };

    // Start music on user interaction (fallback if autoplay blocked)
    const startMusicOnInteraction = () => {
      const handler = () => {
        if (!musicStarted && backgroundAudio) {
          backgroundAudio.volume = 0.4;
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
          document.removeEventListener('keydown', handler);
        }
      };

      // Try multiple events for better compatibility
      document.addEventListener('click', handler, { once: true });
      document.addEventListener('touchstart', handler, { once: true });
      document.addEventListener('scroll', handler, { once: true });
      document.addEventListener('mousemove', handler, { once: true });
      document.addEventListener('keydown', handler, { once: true });
    };

    // Try multiple times to ensure music starts
    // First attempt immediately
    autoStartMusic();
    
    // Try after small delay
    setTimeout(autoStartMusic, 300);
    
    // Try after longer delay
    setTimeout(autoStartMusic, 1000);

    // Also try when audio can play
    if (backgroundAudio) {
      const canPlayHandler = () => {
        console.log('🎵 Audio can play, attempting to start...');
        if (!musicStarted) {
          setTimeout(autoStartMusic, 100);
        }
      };
      
      const loadedDataHandler = () => {
        console.log('🎵 Audio data loaded, attempting to start...');
        if (!musicStarted) {
          setTimeout(autoStartMusic, 200);
        }
      };
      
      // Remove old listeners if any and add new ones
      backgroundAudio.addEventListener('canplay', canPlayHandler, { once: true });
      backgroundAudio.addEventListener('loadeddata', loadedDataHandler, { once: true });
      backgroundAudio.addEventListener('canplaythrough', () => {
        console.log('🎵 Audio can play through, attempting to start...');
        if (!musicStarted) {
          setTimeout(autoStartMusic, 50);
        }
      }, { once: true });
    }

    // Also try when page is fully loaded
    window.addEventListener('load', () => {
      console.log('🎵 Page loaded, attempting to start music...');
      if (!musicStarted && backgroundAudio) {
        setTimeout(autoStartMusic, 100);
      }
    }, { once: true });

    // Handle page visibility for audio management
    document.addEventListener('visibilitychange', () => {
      if (!backgroundAudio) return;
      
      if (document.hidden && !backgroundAudio.paused) {
        backgroundAudio.pause();
      } else if (!document.hidden && musicStarted && backgroundAudio.paused) {
        backgroundAudio.play().catch(() => {});
      }
    });
  }

  // Main title hover effect (visual only, без звука) - only if exists
  if (mainTitle) {
    mainTitle.addEventListener('mouseenter', () => {
      createParticles(mainTitle.getBoundingClientRect());
      createHalloweenTitleEffect();
    });
  }

  // Floating creatures hover (visual only, без звука) - only if they exist
  const pumpkins = document.querySelectorAll('.floating-element, .pumpkin, .ghost, .bat');
  
  if (pumpkins.length > 0) {
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
  }

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

  // Team section hover effects - play theme music - only if sections exist
  if (teamSections.length > 0) {
    teamSections.forEach(section => {
      const theme = section.getAttribute('data-theme');
      
      section.addEventListener('mouseenter', function() {
        // Stop previous team audio if any
        if (currentTeamAudio) {
          currentTeamAudio.pause();
          currentTeamAudio.currentTime = 0;
        }
        
        // Pause main background music (or dim it significantly)
        if (backgroundAudio) {
          if (!backgroundAudio.paused) {
            backgroundAudio.volume = 0.05; // Dim instead of pause for smoother transition
          }
        }
        
        // Get appropriate audio element for theme
        const audioIdMap = {
          royal: 'royal-bg-audio',
          mobile: 'mobile-bg-audio',
          mystics: 'mystics-bg-audio',
          alchemy: 'alchemy-bg-audio',
          recruiter: 'recruiter-bg-audio',
          oracle: 'oracle-bg-audio',
          infra: 'infra-bg-audio',
          detective: 'detective-bg-audio',
          exorcist: 'exorcist-bg-audio',
          specter: 'specter-bg-audio',
          fixiki: 'fixiki-bg-audio',
          starwars: 'starwars-bg-audio',
          art: 'art-bg-audio'
        };
        
        const audioId = audioIdMap[theme];
        if (!audioId) {
          console.warn(`No audio found for theme: ${theme}`);
          return;
        }
        
        const audio = document.getElementById(audioId);
        if (audio) {
          // Ensure audio is set to loop
          audio.loop = true;
          audio.volume = 0.35;
          audio.currentTime = 0;
          
          // Play audio with error handling
          audio.play()
            .then(() => {
              currentTeamAudio = audio;
              console.log(`🎵 Playing theme music for ${theme}`);
            })
            .catch(err => {
              console.warn(`Failed to play audio for ${theme}:`, err);
              // Try to start on user interaction
              const tryPlay = () => {
                audio.play()
                  .then(() => {
                    currentTeamAudio = audio;
                    console.log(`🎵 Playing theme music for ${theme} (after interaction)`);
                  })
                  .catch(() => {/* silent fail */});
              };
              document.addEventListener('click', tryPlay, { once: true });
              document.addEventListener('touchstart', tryPlay, { once: true });
            });
        } else {
          console.warn(`Audio element not found: ${audioId}`);
        }
        
        // Visual effect
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 0 50px currentColor';
      });
      
      section.addEventListener('mouseleave', function() {
        // Stop team theme music
        if (currentTeamAudio) {
          currentTeamAudio.pause();
          currentTeamAudio.currentTime = 0;
          currentTeamAudio = null;
          console.log('🎵 Stopped theme music');
        }
        
        // Resume and restore main background music
        if (backgroundAudio) {
          // Restore volume first
          backgroundAudio.volume = 0.4;
          
          // If music was started but is paused, resume it
          if (musicStarted && backgroundAudio.paused) {
            backgroundAudio.play()
              .then(() => {
                console.log('🎵 Background music resumed after leaving section');
              })
              .catch(err => {
                console.warn('Failed to resume background music:', err);
              });
          }
        }
        
        // Remove visual effect
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
      });
    });
  }

  // Mystery Box Click - Open/Close - only if boxes exist
  const mysteryBoxes = document.querySelectorAll('.mystery-box');
  
  if (mysteryBoxes.length > 0) {
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
  }
  
  // Open Box and Fly Cards Out
  function openBox(boxElement) {
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
      <p class="member-description" style="display: none;">${member.description || ''}</p>
    `;
    
    // Add to container - check if exists
    if (flyingCardsContainer) {
      flyingCardsContainer.appendChild(card);
    } else {
      console.warn('Flying cards container not found');
      return;
    }
    
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
    
    // Gentle hover effect instead of pulse (не для увеличенных карточек)
    card.addEventListener('mouseenter', () => {
      if (card.getAttribute('data-enlarged') !== 'true') {
        card.style.transform = 'scale(1.05)';
        card.style.zIndex = '202';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (card.getAttribute('data-enlarged') !== 'true') {
        card.style.transform = '';
        card.style.zIndex = '201';
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
    
    function closeAllOtherCards() {
      // Закрываем все другие увеличенные карточки
      const allCards = document.querySelectorAll('.flying-card');
      allCards.forEach(otherCard => {
        if (otherCard !== card && otherCard.getAttribute('data-enlarged') === 'true') {
          otherCard.setAttribute('data-enlarged', 'false');
          otherCard.classList.remove('enlarged');
          otherCard.style.transform = '';
          otherCard.style.width = '';
          otherCard.style.height = '';
          otherCard.style.minHeight = '';
          otherCard.style.zIndex = '201';
          otherCard.style.boxShadow = '';
          otherCard.style.filter = '';
          // Resume floating
          const d = Number(otherCard.dataset.floatDuration || '5');
          otherCard.style.animation = `cardFloatFree ${d}s ease-in-out infinite`;
          // Скрываем description
          const descEl = otherCard.querySelector('.member-description');
          if (descEl) descEl.style.display = 'none';
        }
      });
    }
    
    function toggleCardEnlarge() {
      const enlarged = card.getAttribute('data-enlarged') === 'true';
      if (!enlarged) {
        // Закрываем все другие карточки
        closeAllOtherCards();
        
        // Сохраняем текущую позицию из style (реальные значения)
        const currentLeft = parseFloat(card.style.left) || 0;
        const currentTop = parseFloat(card.style.top) || 0;
        
        // Сохраняем исходную позицию для восстановления при закрытии
        card.dataset.originalLeft = currentLeft.toString();
        card.dataset.originalTop = currentTop.toString();
        
        card.setAttribute('data-enlarged', 'true');
        card.dataset.userEnlarged = 'true';
        card.classList.add('enlarged');
        
        // Отменяем любые активные highlight эффекты
        if (card._highlightTimeout1) clearTimeout(card._highlightTimeout1);
        if (card._highlightTimeout2) clearTimeout(card._highlightTimeout2);
        const highlightElements = card.querySelectorAll('[style*="animation: cardHighlight"]');
        highlightElements.forEach(el => el.remove());
        
        card.style.transition = 'all 0.4s ease';
        card.style.width = '350px';
        card.style.height = 'auto';
        card.style.minHeight = '520px';
        card.style.zIndex = '210';
        card.style.boxShadow = '0 0 150px currentColor, 0 0 200px currentColor';
        card.style.filter = 'brightness(1.3)';
        card.style.transform = 'scale(1.6)';
        
        // Оставляем карточку на месте
        card.style.left = currentLeft + 'px';
        card.style.top = currentTop + 'px';
        
        // Проверяем не выходит ли за нижний край после увеличения
        setTimeout(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const cardRect = card.getBoundingClientRect();
              const bottomEdge = cardRect.bottom;
              const viewportHeight = window.innerHeight;
              
              // Если выходит за нижний край - немного поднимаем без transition
              if (bottomEdge > viewportHeight - 20) {
                const overflow = bottomEdge - (viewportHeight - 20);
                const newTop = parseFloat(card.style.top) - overflow;
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease';
                card.style.top = Math.max(20, newTop) + 'px';
              }
            });
          });
        }, 100);
        
        // Stop floating entirely чтобы не тянуло карту
        card.dataset.prevAnimation = card.style.animation || '';
        card.style.animation = 'none';
        // Показываем весь текст и description
        const roleEl = card.querySelector('.member-role');
        const powerEl = card.querySelector('.member-power');
        const descEl = card.querySelector('.member-description');
        if (roleEl) roleEl.style.display = 'block';
        if (powerEl) powerEl.style.display = 'block';
        if (descEl && descEl.textContent.trim()) descEl.style.display = 'block';
      } else {
        // Восстанавливаем исходную позицию
        const originalLeft = card.dataset.originalLeft;
        const originalTop = card.dataset.originalTop;
        
        if (originalLeft) card.style.left = originalLeft + 'px';
        if (originalTop) card.style.top = originalTop + 'px';
        
        card.setAttribute('data-enlarged', 'false');
        delete card.dataset.userEnlarged;
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
        // Скрываем description
        const descEl = card.querySelector('.member-description');
        if (descEl) descEl.style.display = 'none';
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

  // Random green glow pulses on team sections - only if sections exist
  if (teamSections.length > 0) {
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
  }

  // Add hover effect for tower logo
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

  // Scroll to Top Button
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  if (scrollToTopBtn) {
    // Scroll to top on click - button is always visible
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  console.log('👥 Teams page initialized!');
});

