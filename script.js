// DOM Elements
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const buttonsContainer = document.getElementById('buttonsContainer');
const backBtn = document.getElementById('backBtn');
const shareBtn = document.getElementById('shareBtn');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const confettiCanvas = document.getElementById('confetti-canvas');

// Audio elements (with mobile-compatible fallbacks)
const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
const yesSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
const noSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cartoon-toy-whistle-401.mp3');
const fireworksSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fireworks-show-audio-3061.mp3');

// Configure audio for mobile
[clickSound, yesSound, noSound, fireworksSound].forEach(sound => {
    sound.volume = 0.5;
    sound.preload = 'auto';
});

// Set next Valentine's Day
const today = new Date();
let valentinesYear = today.getFullYear();
const valentinesDate = new Date(valentinesYear, 1, 14);

if (today > valentinesDate) {
    valentinesYear += 1;
    valentinesDate.setFullYear(valentinesYear);
}

// Confetti and fireworks variables
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let fireworkParticles = [];
let animationId = null;
const confettiColors = ['#ff4081', '#ff79a6', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#00bcd4'];

// Initialize canvas size
function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Sound functions with mobile fix
function playSound(audio) {
    // Mobile browsers require user interaction first
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(e => {
            console.log("Audio play failed, continuing silently:", e);
        });
    }
}

// Create confetti particles
function createConfetti(count = 200) {
    for (let i = 0; i < count; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            radius: Math.random() * 8 + 4,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speed: Math.random() * 4 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            life: 100
        });
    }
}

// Create firework explosion
function createFirework(x, y, color) {
    const particleCount = 30;
    const power = 6;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * power + 2;
        
        fireworkParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 4 + 2,
            color: color || confettiColors[Math.floor(Math.random() * confettiColors.length)],
            gravity: 0.05,
            life: 100,
            alpha: 1
        });
    }
}

// Draw all particles
function drawParticles() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    // Draw confetti particles
    for (let i = 0; i < confettiParticles.length; i++) {
        const p = confettiParticles[i];
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = p.life / 100;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Update position
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.01) * 1;
        p.rotation += p.rotationSpeed;
        p.life -= 0.5;
        
        // Remove dead particles
        if (p.life <= 0 || p.y > confettiCanvas.height) {
            confettiParticles.splice(i, 1);
            i--;
        }
    }
    
    // Draw firework particles
    for (let i = 0; i < fireworkParticles.length; i++) {
        const p = fireworkParticles[i];
        
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= 2;
        p.alpha = p.life / 100;
        
        // Remove dead particles
        if (p.life <= 0) {
            fireworkParticles.splice(i, 1);
            i--;
        }
    }
    
    // Continue animation if there are particles
    if (confettiParticles.length > 0 || fireworkParticles.length > 0) {
        animationId = requestAnimationFrame(drawParticles);
    } else {
        animationId = null;
    }
}

// Start celebration animation
function startCelebration() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    confettiParticles = [];
    fireworkParticles = [];
    createConfetti(150);
    
    playSound(yesSound);
    playSound(fireworksSound);
    
    // Create firework bursts
    const positions = [
        [confettiCanvas.width * 0.2, confettiCanvas.height * 0.3, '#ff4081'],
        [confettiCanvas.width * 0.8, confettiCanvas.height * 0.4, '#ffc107'],
        [confettiCanvas.width * 0.5, confettiCanvas.height * 0.2, '#4caf50'],
        [confettiCanvas.width * 0.3, confettiCanvas.height * 0.6, '#2196f3'],
        [confettiCanvas.width * 0.7, confettiCanvas.height * 0.5, '#9c27b0']
    ];
    
    positions.forEach((pos, index) => {
        setTimeout(() => createFirework(pos[0], pos[1], pos[2]), index * 500);
    });
    
    drawParticles();
}

// FIXED: Move No button function for mobile compatibility
function moveNoButton() {
    playSound(noSound);
    playSound(clickSound);
    
    // Get container dimensions
    const containerWidth = buttonsContainer.offsetWidth;
    const containerHeight = buttonsContainer.offsetHeight;
    
    // Get button dimensions
    const buttonWidth = noBtn.offsetWidth;
    const buttonHeight = noBtn.offsetHeight;
    
    // Calculate safe area (keep button fully visible)
    const safeX = containerWidth - buttonWidth - 20;
    const safeY = containerHeight - buttonHeight - 20;
    
    // Generate random positions within safe area
    const randomX = Math.floor(Math.random() * safeX) + 10;
    const randomY = Math.floor(Math.random() * safeY) + 10;
    
    // Apply the new position
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    
    // Add shake animation for mobile touch feedback
    noBtn.classList.add('shake');
    setTimeout(() => {
        noBtn.classList.remove('shake');
    }, 500);
}

// Update countdown timer
function updateCountdown() {
    const now = new Date();
    const timeRemaining = valentinesDate - now;
    
    if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    } else {
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        
        const celebrationMessage = document.querySelector('.celebration-message h2');
        if (celebrationMessage) {
            celebrationMessage.textContent = "Happy Valentine's Day! ❤️";
        }
    }
}

// Share function
function shareResult() {
    playSound(clickSound);
    
    const shareData = {
        title: 'I said YES to being their Valentine! ❤️',
        text: 'I just accepted a Valentine\'s Day proposal! Spread the love this Valentine\'s Day!',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = `${shareData.text} ${shareData.url}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        shareBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share the News';
        }, 2000);
    }
}

// Add mobile touch support
function initializeMobileTouch() {
    // Make sure buttonsContainer has relative positioning
    buttonsContainer.style.position = 'relative';
    
    // Set No button to absolute positioning
    noBtn.style.position = 'absolute';
    noBtn.style.transition = 'left 0.3s ease, top 0.3s ease';
    
    // Set initial position
    noBtn.style.left = '50%';
    noBtn.style.top = '50%';
    noBtn.style.transform = 'translate(-50%, -50%)';
    
    // Add CSS for shake animation
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            25% { transform: translate(-50%, -50%) rotate(-3deg); }
            50% { transform: translate(-50%, -50%) rotate(3deg); }
            75% { transform: translate(-50%, -50%) rotate(-3deg); }
        }
        
        /* Touch feedback for mobile */
        .btn:active {
            transform: scale(0.95);
        }
        
        /* Prevent text selection on mobile */
        .no-btn {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    `;
    document.head.appendChild(style);
}

// Event Listeners
yesBtn.addEventListener('click', () => {
    playSound(clickSound);
    page1.classList.remove('active');
    page2.classList.add('active');
    startCelebration();
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

noBtn.addEventListener('click', moveNoButton);

// For mobile: also move on touch
noBtn.addEventListener('touchstart', (e) => {
    // Prevent default to avoid double-tap zoom
    e.preventDefault();
    moveNoButton();
});

// Also move on hover for desktop
noBtn.addEventListener('mouseenter', (e) => {
    if (window.innerWidth > 768 && Math.random() < 0.3) {
        setTimeout(moveNoButton, 100);
    }
});

// Add click feedback to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        playSound(clickSound);
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Touch feedback for mobile
    button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

backBtn.addEventListener('click', () => {
    playSound(clickSound);
    page2.classList.remove('active');
    page1.classList.add('active');
    
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    confettiParticles = [];
    fireworkParticles = [];
});

shareBtn.addEventListener('click', shareResult);

// Initialize on load
window.addEventListener('load', () => {
    initializeMobileTouch();
    updateCountdown();
    
    // Set initial random position for No button
    setTimeout(() => {
        moveNoButton();
    }, 100);
    
    // Preload sounds
    [clickSound, yesSound, noSound, fireworksSound].forEach(sound => {
        sound.load();
    });
});

// Handle mobile orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        resizeCanvas();
        moveNoButton();
    }, 100);
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'y' || e.key === 'Y') {
        yesBtn.click();
    } else if (e.key === 'n' || e.key === 'N') {
        moveNoButton();
    } else if (e.key === 'Escape' && page2.classList.contains('active')) {
        backBtn.click();
    }
});

// Mobile swipe support
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    if (!page2.classList.contains('active')) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 100) {
        backBtn.click();
    }
});

// Force mobile viewport to work properly
document.addEventListener('DOMContentLoaded', function() {
    // Fix for mobile viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehaviorY = 'contain';
    
    // Set container height properly
    buttonsContainer.style.minHeight = '200px';
    buttonsContainer.style.height = 'auto';
});