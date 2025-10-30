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

  // Team section click effects - play theme music - only if sections exist
  let activeSection = null; // Отслеживаем активную секцию (глобально для доступа из других функций)
  if (teamSections.length > 0) {
    
    // Функция для проверки наличия открытых увеличенных карточек из секции
    function hasEnlargedCardsFromSection(sectionId) {
      if (!sectionId) return false;
      const allCards = document.querySelectorAll('.flying-card');
      for (let card of allCards) {
        if (card.getAttribute('data-enlarged') === 'true' && 
            card.dataset.teamId === sectionId) {
          return true;
        }
      }
      return false;
    }
    
    // Функция для остановки музыки команды
    function stopTeamAudio() {
      // Проверяем, есть ли открытые карточки из активной секции
      if (activeSection) {
        const sectionId = activeSection.id;
        if (hasEnlargedCardsFromSection(sectionId)) {
          // Если есть открытые карточки - не останавливаем музыку
          return;
        }
      }
      if (currentTeamAudio) {
        currentTeamAudio.pause();
        currentTeamAudio.currentTime = 0;
        currentTeamAudio = null;
      }
      
      // Восстанавливаем фоновую музыку
      if (backgroundAudio) {
        backgroundAudio.volume = 0.4;
        if (musicStarted && backgroundAudio.paused) {
          backgroundAudio.play()
            .then(() => {
              console.log('🎵 Background music resumed');
            })
            .catch(() => {/* silent fail */});
        }
      }
      
      // Сбрасываем визуальные эффекты всех секций
      teamSections.forEach(s => {
        s.style.transform = 'scale(1)';
        s.style.boxShadow = 'none';
      });
    }
    
    // Функция для запуска музыки секции по theme
    function playTeamAudio(theme, sectionElement) {
      // Останавливаем предыдущую музыку
      if (currentTeamAudio) {
        currentTeamAudio.pause();
        currentTeamAudio.currentTime = 0;
        currentTeamAudio = null;
      }
      
      // Останавливаем или сильно приглушаем фоновую музыку
      if (backgroundAudio) {
        if (!backgroundAudio.paused) {
          backgroundAudio.volume = 0.02; // Сильно приглушаем, чтобы музыка секции была слышна
        }
      }
      
      const audioIdMap = {
        royal: 'royal-bg-audio',
        mobile: 'mobile-bg-audio',
        mystics: 'mystics-bg-audio',
        alchemy: 'alchemy-bg-audio',
        recruiter: 'recruiter-bg-audio',
        support: 'support-bg-audio',
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
        audio.loop = true;
        audio.volume = 0.35;
        audio.currentTime = 0;
        
        audio.play()
          .then(() => {
            currentTeamAudio = audio;
            if (sectionElement) {
              activeSection = sectionElement;
            }
            console.log(`🎵 Playing theme music for ${theme}`);
          })
          .catch(err => {
            console.warn(`Failed to play audio for ${theme}:`, err);
          });
      }
    }
    
    // Делаем функции доступными глобально для использования в других местах
    window.stopTeamAudio = stopTeamAudio;
    window.playTeamAudio = playTeamAudio;
    window.hasEnlargedCardsFromSection = hasEnlargedCardsFromSection;
    
    teamSections.forEach(section => {
      const theme = section.getAttribute('data-theme');
      
      section.addEventListener('click', function(e) {
        // Предотвращаем всплытие клика
        e.stopPropagation();
        
        // Музыка не запускается при клике на секцию
        // Музыка запускается только при открытии box-3d или увеличенной карточки
        
        // Visual effect только
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 0 50px currentColor';
      });
      
      // Сохраняем hover эффекты для визуального отклика
      section.addEventListener('mouseenter', function() {
        // Показываем эффект только если секция не активна или вообще не активна
        if (activeSection !== this) {
          this.style.transform = 'scale(1.02)';
          this.style.boxShadow = '0 0 50px currentColor';
        }
      });
      
      section.addEventListener('mouseleave', function() {
        // Убираем эффект только если секция не активна
        if (activeSection !== this) {
          this.style.transform = 'scale(1)';
          this.style.boxShadow = 'none';
        }
      });
    });
    
    // Клик вне секции - останавливаем музыку (но не если бокс открыт или есть открытые карточки)
    document.addEventListener('click', function(e) {
      // Проверяем что клик был не на секцию и не внутри секции
      const clickedSection = e.target.closest('.team-section');
      // Также не останавливаем если клик был на увеличенную карточку
      const clickedCard = e.target.closest('.flying-card.enlarged');
      // Проверяем, есть ли открытые боксы
      const openBoxes = document.querySelectorAll('.mystery-box.opened');
      const hasOpenBox = openBoxes.length > 0;
      
      if (!clickedSection && !clickedCard && activeSection && !hasOpenBox) {
        // Проверяем, есть ли открытые карточки из активной секции
        const sectionId = activeSection.id;
        const hasOpenCards = hasEnlargedCardsFromSection(sectionId);
        
        // Останавливаем музыку только если нет открытых боксов и нет открытых карточек
        if (!hasOpenCards) {
          stopTeamAudio();
          activeSection = null;
        }
      }
    });
  }

  // Mystery Box Click - Open/Close - only if boxes exist
  const mysteryBoxes = document.querySelectorAll('.mystery-box');
  
  if (mysteryBoxes.length > 0) {
    mysteryBoxes.forEach(box => {
      box.addEventListener('click', function() {
        const isOpen = this.classList.contains('opened');
        const isOpening = this.dataset.opening === 'true';
        
        // Блокируем все действия (открытие и закрытие), пока создаются карточки
        if (isOpening) {
          return;
        }
        
        if (isOpen) {
          // Close this box
          closeBox(this);
        } else {
          // Close any other open box first (если есть открытый бокс)
          if (currentOpenBox && currentOpenBox !== this) {
            closeBox(currentOpenBox);
            // Ждём немного, чтобы предыдущий бокс успел закрыться перед открытием нового
            setTimeout(() => {
              openBox(this);
            }, 300);
          } else {
            // Open this box immediately if no other box is open
            openBox(this);
          }
        }
      });
    });
  }

  // Open Box and Fly Cards Out
  function openBox(boxElement) {
    // Проверяем, не открыт ли бокс уже или не открывается ли
    if (boxElement.classList.contains('opened') || boxElement.dataset.opening === 'true') {
      return; // Уже открыт или открывается
    }
    
    const membersData = boxElement.getAttribute('data-members');
    
    if (!membersData) return;
    
    try {
      const members = JSON.parse(membersData);
      const theme = boxElement.getAttribute('data-theme');
      const teamId = boxElement.closest('.team-section')?.id || 'unknown';
      
      // Помечаем бокс как открывающийся (блокируем повторные клики)
      boxElement.dataset.opening = 'true';
      
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
      
      // Вычисляем время создания всех карточек
      const cardsCreationTime = members.length * 150; // время на создание всех карточек
      
      // Fly cards out
      members.forEach((member, index) => {
        setTimeout(() => {
          createFlyingCard(member, boxCenterX, boxCenterY, theme, teamId);
        }, index * 150);
      });
      
      // Сбрасываем флаг opening только после того, как все карточки будут созданы
      // Добавляем небольшую задержку для уверенности, что все карточки созданы
      setTimeout(() => {
        delete boxElement.dataset.opening;
      }, cardsCreationTime + 200);
      
      // Start presentation sequence after all cards created
      setTimeout(() => presentTeamCards(teamId), members.length * 180 + 400);
      
      // Запускаем музыку секции при открытии box-3d
      if (theme && window.playTeamAudio) {
        const sectionElement = teamId !== 'unknown' ? document.getElementById(teamId) : null;
        window.playTeamAudio(theme, sectionElement);
      }
      
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
    
    // Сразу сбрасываем состояние бокса, чтобы можно было открыть другой
    boxElement.classList.remove('opened');
    delete boxElement.dataset.opening; // Сбрасываем флаг opening
    if (currentOpenBox === boxElement) {
      currentOpenBox = null;
    }
    
    // Останавливаем музыку секции при закрытии box-3d и возвращаем фоновую
    const boxTheme = boxElement.getAttribute('data-theme');
    const boxTeamId = teamId !== 'unknown' ? teamId : null;
    
    // Проверяем, остались ли еще открытые боксы после закрытия этого
    // Делаем небольшую задержку, чтобы класс 'opened' успел удалиться
    setTimeout(() => {
      const openBoxes = document.querySelectorAll('.mystery-box.opened');
      const hasOpenBoxes = openBoxes.length > 0;
      
      // Также проверяем, есть ли открытые увеличенные карточки из этой секции
      const hasEnlargedCardsFromSection = boxTeamId && window.hasEnlargedCardsFromSection 
        ? window.hasEnlargedCardsFromSection(boxTeamId) 
        : false;
      
      if (!hasOpenBoxes && !hasEnlargedCardsFromSection) {
        // Если все боксы закрыты И нет открытых карточек из этой секции - останавливаем музыку
        if (boxTheme && window.stopTeamAudio) {
          const activeSectionId = activeSection ? activeSection.id : null;
          // Если музыка играет и активная секция соответствует боксу или секция не активна - останавливаем
          if (!activeSection || activeSectionId === boxTeamId) {
            window.stopTeamAudio();
            if (activeSection && activeSectionId === boxTeamId) {
              activeSection = null;
            }
          }
        }
      } else {
        // Если еще есть открытые боксы или открытые карточки - музыка секции продолжает играть
        // (или может переключиться на другую секцию, если открыт другой бокс)
      }
    }, 50);
    
    // Также сбрасываем через таймаут для финального состояния (на случай если нужна визуальная анимация)
    setTimeout(() => {
      boxElement.classList.remove('opened');
      if (currentOpenBox === boxElement) {
        currentOpenBox = null;
      }
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
      <img src="${member.avatar || member.image}" alt="${member.name}">
      <h3 class="member-title">${member.name}</h3>
      <p class="member-role" style="display: none;">${member.role}</p>
      <p class="member-power" style="display: none;">"${member.power}"</p>
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
    // Store team info for music playback
    card.dataset.teamId = teamId;
    card.dataset.teamTheme = theme;
    
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
          // Скрываем description, role и power - показываем только avatar и name
          const descEl = otherCard.querySelector('.member-description');
          const roleEl = otherCard.querySelector('.member-role');
          const powerEl = otherCard.querySelector('.member-power');
          if (descEl) descEl.style.display = 'none';
          if (roleEl) roleEl.style.display = 'none';
          if (powerEl) powerEl.style.display = 'none';
          
          // Восстанавливаем фон и показываем аватарку
          otherCard.style.background = '';
          otherCard.style.backgroundImage = '';
          otherCard.style.backgroundSize = '';
          otherCard.style.backgroundPosition = '';
          otherCard.style.backgroundRepeat = '';
          otherCard.style.backgroundBlendMode = '';
          otherCard.style.color = '';
          const imgEl = otherCard.querySelector('img');
          if (imgEl) {
            const avatarUrl = otherCard.memberData?.avatar || otherCard.memberData?.image || '';
            if (avatarUrl) imgEl.src = avatarUrl;
            imgEl.style.display = 'block';
          }
          
          // Восстанавливаем имя
          const titleEl = otherCard.querySelector('.member-title');
          if (titleEl && otherCard.dataset.originalTitle !== undefined) {
            titleEl.textContent = otherCard.dataset.originalTitle;
          }
        }
      });
    }
    
    function minimizeOtherCards(excludeCard) {
      // Уменьшаем все другие карточки, но не увеличенные
      const allCards = document.querySelectorAll('.flying-card');
      allCards.forEach(otherCard => {
        // Исключаем увеличенную карточку и ту карточку, которая будет увеличенной
        if (otherCard !== excludeCard && otherCard.getAttribute('data-enlarged') !== 'true') {
          // Сохраняем оригинальный размер для восстановления
          if (!otherCard.dataset.originalScale) {
            otherCard.dataset.originalScale = otherCard.style.transform || '';
          }
          otherCard.style.transition = 'all 0.3s ease';
          otherCard.style.transform = 'scale(0.7)';
          otherCard.style.opacity = '0.5';
          otherCard.style.zIndex = '200';
        }
      });
    }
    
    function restoreOtherCards() {
      // Восстанавливаем все карточки к нормальному размеру
      const allCards = document.querySelectorAll('.flying-card');
      allCards.forEach(otherCard => {
        if (otherCard.getAttribute('data-enlarged') !== 'true') {
          otherCard.style.transition = 'all 0.3s ease';
          const originalScale = otherCard.dataset.originalScale || '';
          otherCard.style.transform = originalScale;
          otherCard.style.opacity = '1';
          otherCard.style.zIndex = '201';
          delete otherCard.dataset.originalScale;
          
          // Убеждаемся, что на закрытых карточках показываются только avatar и name
          const roleEl = otherCard.querySelector('.member-role');
          const powerEl = otherCard.querySelector('.member-power');
          const descEl = otherCard.querySelector('.member-description');
          if (roleEl) roleEl.style.display = 'none';
          if (powerEl) powerEl.style.display = 'none';
          if (descEl) descEl.style.display = 'none';
          
          // Показываем аватарку
          const imgEl = otherCard.querySelector('img');
          if (imgEl) {
            imgEl.style.display = 'block';
          }
        }
      });
    }
    
    function toggleCardEnlarge() {
      const enlarged = card.getAttribute('data-enlarged') === 'true';
      if (!enlarged) {
        // Закрываем все другие карточки
        closeAllOtherCards();
        
        // Уменьшаем все остальные карточки
        minimizeOtherCards(card);
        
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
        card.style.width = '320px';
        card.style.height = 'auto';
        card.style.minHeight = '410px';
        card.style.zIndex = '210';
        card.style.boxShadow = '0 0 60px rgba(0,0,0,0.6), 0 0 90px currentColor';
        card.style.filter = 'none';
        card.style.opacity = '1'; // Убеждаемся что увеличенная карточка полностью видна
        card.style.transform = 'scale(1.3)';
        // Подвинуть текст ниже при раскрытой карточке
        card.style.paddingTop = '4rem';
        // Поставить картинку на фон и скрыть аватарку
        const imgEl = card.querySelector('img');
        if (imgEl) {
          imgEl.style.display = 'none';
        }
        const bgUrl = card.memberData?.image || card.memberData?.avatar || '';
        if (bgUrl) {
          // Сбрасываем фон из базовых стилей и делаем более прозрачный оверлей
          card.style.background = 'none';
          card.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url(${bgUrl})`;
          // Градиент и изображение покрывают всю карточку (может быть небольшая обрезка)
          card.style.backgroundSize = 'cover, cover';
          card.style.backgroundPosition = 'center, center';
          card.style.backgroundRepeat = 'no-repeat, no-repeat';
          card.style.backgroundBlendMode = 'multiply';
          card.style.color = '#ffffff';
        }
        
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
        // Заменяем имя на nickname (если есть)
        const titleEl = card.querySelector('.member-title');
        card.dataset.originalTitle = titleEl ? titleEl.textContent || '' : '';
        const nickname = card.memberData?.nickname;
        if (titleEl && nickname) {
          titleEl.textContent = nickname;
        }

        // Показываем весь текст и description
        const roleEl = card.querySelector('.member-role');
        const powerEl = card.querySelector('.member-power');
        const descEl = card.querySelector('.member-description');
        if (roleEl) roleEl.style.display = 'block';
        if (powerEl) powerEl.style.display = 'block';
        if (descEl && descEl.textContent.trim()) descEl.style.display = 'block';
        
        // Запускаем музыку секции при открытии увеличенной карточки (только если бокс не открыт)
        const cardTheme = card.dataset.teamTheme;
        const cardTeamId = card.dataset.teamId;
        if (cardTheme && window.playTeamAudio && cardTeamId) {
          // Проверяем, открыт ли бокс этой секции
          const sectionElement = document.getElementById(cardTeamId);
          const sectionBox = sectionElement ? sectionElement.querySelector('.mystery-box') : null;
          const isBoxOpen = sectionBox && sectionBox.classList.contains('opened');
          
          // Если бокс не открыт, запускаем музыку через карточку
          if (!isBoxOpen) {
            window.playTeamAudio(cardTheme, sectionElement);
          }
          // Если бокс открыт, музыка уже должна играть - ничего не делаем
        }
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
        // Вернуть изначальный вид карточки - скрываем фон и показываем аватарку
        card.style.background = '';
        card.style.backgroundImage = '';
        card.style.backgroundSize = '';
        card.style.backgroundPosition = '';
        card.style.backgroundRepeat = '';
        card.style.backgroundBlendMode = '';
        card.style.color = '';
        card.style.paddingTop = '';
        
        // Показываем аватарку
        const imgEl = card.querySelector('img');
        if (imgEl) {
          // Restore avatar (prefer explicit avatar if provided)
          const avatarUrl = card.memberData?.avatar || card.memberData?.image || '';
          if (avatarUrl) imgEl.src = avatarUrl;
          imgEl.style.display = 'block';
        }
        
        // Вернуть исходный заголовок (имя) - показываем имя вместо nickname
        const titleEl = card.querySelector('.member-title');
        if (titleEl && card.dataset.originalTitle !== undefined) {
          titleEl.textContent = card.dataset.originalTitle;
        }

        // Восстанавливаем остальные карточки к нормальному размеру
        restoreOtherCards();
        
        // Resume floating
        const d = Number(card.dataset.floatDuration || '5');
        card.style.animation = `cardFloatFree ${d}s ease-in-out infinite`;
        // Скрываем description, role и power - показываем только avatar и name
        const descEl = card.querySelector('.member-description');
        if (descEl) descEl.style.display = 'none';
        const roleEl = card.querySelector('.member-role');
        const powerEl = card.querySelector('.member-power');
        if (roleEl) roleEl.style.display = 'none';
        if (powerEl) powerEl.style.display = 'none';
        
        // Останавливаем музыку секции и возвращаем фоновую при закрытии увеличенной карточки
        // НО только если бокс не открыт И нет других открытых карточек (музыка должна играть пока открыт бокс или карточки)
        const cardTeamId = card.dataset.teamId;
        const cardTheme = card.dataset.teamTheme;
        if (cardTeamId && cardTheme && window.stopTeamAudio) {
          // Проверяем, открыт ли бокс этой секции
          const sectionElement = document.getElementById(cardTeamId);
          const sectionBox = sectionElement ? sectionElement.querySelector('.mystery-box') : null;
          const isBoxOpen = sectionBox && sectionBox.classList.contains('opened');
          
          // Также проверяем, есть ли другие открытые увеличенные карточки из этой секции
          // Сначала временно закрываем текущую карточку для проверки
          const tempEnlarged = card.getAttribute('data-enlarged');
          card.setAttribute('data-enlarged', 'false');
          const hasOtherEnlargedCards = window.hasEnlargedCardsFromSection 
            ? window.hasEnlargedCardsFromSection(cardTeamId)
            : false;
          // Восстанавливаем состояние карточки для проверки
          card.setAttribute('data-enlarged', tempEnlarged);
          
          // Останавливаем музыку только если бокс закрыт И нет других открытых карточек из этой секции
          if (!isBoxOpen && !hasOtherEnlargedCards) {
            const activeSectionId = activeSection ? activeSection.id : null;
            // Если секция не активна или это та же секция - останавливаем музыку
            if (!activeSection || activeSectionId === cardTeamId) {
              window.stopTeamAudio();
              if (activeSection && activeSectionId === cardTeamId) {
                activeSection = null;
              }
            }
          }
          // Если бокс открыт или есть другие открытые карточки, музыка продолжает играть - ничего не делаем
        }
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

