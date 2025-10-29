// ===== UTILITY FUNCTIONS - Shared across all pages =====

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

// ===== OTHER EFFECTS =====

// Halloween Title Effect
function createHalloweenTitleEffect() {
  const mainTitleEl = document.getElementById('main-title');
  if (!mainTitleEl) return; // Early exit if element doesn't exist
  
  const titleRect = mainTitleEl.getBoundingClientRect();
  
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

// Highlight member card with animation
function highlightMemberCard(card) {
  if (!card) return;
  // Если пользователь уже увеличил карточку — пропускаем авто‑highlight
  if (card.getAttribute('data-enlarged') === 'true' || card.dataset.userEnlarged === 'true') {
    return;
  }
  
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
  
  // Remove highlight and return to normal
  const timeout1 = setTimeout(() => {
    highlight.remove();
    const timeout2 = setTimeout(() => {
      // Не меняем стили если карточка уже увеличена пользователем
      if (card.getAttribute('data-enlarged') !== 'true') {
        card.style.transform = '';
        card.style.filter = '';
        card.style.zIndex = '201';
        card.style.boxShadow = '';
      }
    }, 100);
    card._highlightTimeout2 = timeout2;
  }, 200);
  card._highlightTimeout1 = timeout1;
}

