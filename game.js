// game.js - Complete Heart Collection Game (FIXED VERSION)

// Game state
let gameState = {
    heartsCollected: 0,
    totalHearts: 10,
    gameStarted: false,
    startTime: null,
    timerInterval: null,
    hearts: []
};

// DOM Elements
const heartsCounter = document.getElementById('heartsCounter');
const levelElement = document.getElementById('level');
const timerElement = document.getElementById('timer');
const collectionProgress = document.getElementById('collectionProgress');
const progressPercent = document.getElementById('progressPercent');
const specialMessageSection = document.getElementById('specialMessage');
const heartsCollectedDisplay = document.getElementById('heartsCollectedDisplay');
const timeTakenDisplay = document.getElementById('timeTakenDisplay');
const startButton = document.getElementById('startButton');
const heartContainer = document.getElementById('heartContainer');

// Game initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize display
    updateHeartsDisplay();
    updateTimerDisplay();
    updateProgressBar();
    
    // Add click event to start button
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    
    console.log('Game initialized successfully!');
});

// Start the game
function startGame() {
    if (gameState.gameStarted) return;
    
    console.log('Starting game...');
    
    gameState.gameStarted = true;
    gameState.startTime = new Date();
    gameState.heartsCollected = 0;
    gameState.hearts = [];
    
    // Update start button
    if (startButton) {
        startButton.disabled = true;
        startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Game Started!';
        startButton.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
    }
    
    // Hide the special message
    if (specialMessageSection) {
        specialMessageSection.style.display = 'none';
    }
    
    // Clear heart container
    if (heartContainer) {
        heartContainer.innerHTML = '';
        heartContainer.style.position = 'relative';
        heartContainer.style.minHeight = '400px';
    }
    
    // Start the timer
    startTimer();
    
    // Create hearts
    createHearts();
    
    // Update displays
    updateHeartsDisplay();
    updateProgressBar();
}

// Create 10 hidden hearts
function createHearts() {
    if (!heartContainer) return;
    
    // Clear existing hearts
    gameState.hearts.forEach(heart => {
        if (heart.element && heart.element.parentNode) {
            heart.element.parentNode.removeChild(heart.element);
        }
    });
    
    gameState.hearts = [];
    
    // Create 10 hearts at random positions
    for (let i = 0; i < gameState.totalHearts; i++) {
        setTimeout(() => {
            createHeart(i);
        }, i * 100);
    }
}

// Create a single heart
function createHeart(index) {
    if (!heartContainer) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.dataset.index = index;
    heart.innerHTML = '💖';
    heart.title = 'Click me!';
    
    // Random position (keep within container)
    const containerWidth = heartContainer.clientWidth - 40;
    const containerHeight = heartContainer.clientHeight - 40;
    
    const posX = Math.random() * (containerWidth - 40);
    const posY = Math.random() * (containerHeight - 40);
    
    heart.style.cssText = `
        position: absolute;
        left: ${posX}px;
        top: ${posY}px;
        font-size: 32px;
        cursor: pointer;
        opacity: 0.8;
        transform: scale(0);
        transition: transform 0.5s, opacity 0.3s;
        animation: float 3s ease-in-out infinite;
        animation-delay: ${index * 0.2}s;
        z-index: 10;
        user-select: none;
    `;
    
    // Add click event
    heart.addEventListener('click', () => collectHeart(index));
    
    // Animate appearance
    setTimeout(() => {
        heart.style.transform = 'scale(1)';
    }, 100);
    
    heartContainer.appendChild(heart);
    
    // Store heart reference
    gameState.hearts.push({
        element: heart,
        collected: false,
        index: index
    });
}

// Collect a heart
function collectHeart(index) {
    if (!gameState.gameStarted || 
        index >= gameState.hearts.length || 
        gameState.hearts[index].collected) return;
    
    console.log(`Collecting heart ${index + 1}`);
    
    // Mark as collected
    gameState.hearts[index].collected = true;
    gameState.heartsCollected++;
    
    // Animate collection
    const heart = gameState.hearts[index].element;
    if (heart) {
        heart.style.transform = 'scale(1.5)';
        heart.style.opacity = '0';
        heart.style.cursor = 'default';
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 300);
    }
    
    // Play collection sound
    playHeartSound();
    
    // Update displays
    updateHeartsDisplay();
    updateProgressBar();
    
    // Check for game completion
    if (gameState.heartsCollected >= gameState.totalHearts) {
        endGame();
    }
}

// Update hearts counter display
function updateHeartsDisplay() {
    if (heartsCounter) {
        heartsCounter.textContent = `${gameState.heartsCollected} / ${gameState.totalHearts}`;
        heartsCounter.style.color = gameState.heartsCollected === gameState.totalHearts ? '#4CAF50' : '#ff4081';
    }
}

// Start the timer
function startTimer() {
    // Clear any existing timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Update timer every second
    gameState.timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Update timer display
function updateTimerDisplay() {
    if (!timerElement || !gameState.gameStarted) return;
    
    if (gameState.startTime) {
        const now = new Date();
        const diff = Math.floor((now - gameState.startTime) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        
        timerElement.textContent = `${minutes}:${seconds}`;
    } else {
        timerElement.textContent = '00:00';
    }
}

// Update progress bar
function updateProgressBar() {
    if (!collectionProgress || !progressPercent) return;
    
    const percentage = (gameState.heartsCollected / gameState.totalHearts) * 100;
    const roundedPercentage = Math.round(percentage);
    
    // Update progress bar width
    collectionProgress.style.width = `${percentage}%`;
    
    // Update percentage text
    progressPercent.textContent = `${roundedPercentage}%`;
    
    // Update progress bar text
    collectionProgress.textContent = `${roundedPercentage}%`;
}

// End the game
function endGame() {
    console.log('Game completed!');
    
    gameState.gameStarted = false;
    
    // Stop timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Calculate final time
    const endTime = new Date();
    const totalSeconds = Math.floor((endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    
    // Update displays
    if (heartsCollectedDisplay) {
        heartsCollectedDisplay.textContent = gameState.heartsCollected;
    }
    
    if (timeTakenDisplay) {
        timeTakenDisplay.textContent = `${minutes}:${seconds}`;
    }
    
    // Show special message
    if (specialMessageSection) {
        specialMessageSection.style.display = 'block';
        specialMessageSection.style.opacity = '0';
        specialMessageSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            specialMessageSection.style.transition = 'all 0.8s ease';
            specialMessageSection.style.opacity = '1';
            specialMessageSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Show confetti effect
    createConfetti();
    
    // Reset start button
    if (startButton) {
        setTimeout(() => {
            startButton.disabled = false;
            startButton.innerHTML = '<i class="fas fa-redo"></i> Play Again';
            startButton.style.background = 'linear-gradient(135deg, #2196F3, #1976D32)';
            
            // Add click event for replay
            startButton.onclick = function() {
                resetGame();
                startGame();
            };
        }, 2000);
    }
}

// Create confetti effect
function createConfetti() {
    if (!heartContainer) return;
    
    const colors = ['#ff4081', '#ff6b9d', '#ff9800', '#4CAF50', '#2196F3'];
    const heartIcons = ['💖', '💕', '💝', '💗', '💓', '❤️', '🧡', '💛', '💚', '💙', '💜'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        confetti.style.cssText = `
            position: absolute;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            top: -30px;
            left: ${Math.random() * 100}%;
            opacity: 0.9;
        `;
        
        heartContainer.appendChild(confetti);
        
        // Animate falling
        const animation = confetti.animate([
            { 
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1 
            },
            { 
                transform: `translate(${Math.random() * 100 - 50}px, 500px) rotate(${Math.random() * 360}deg)`,
                opacity: 0 
            }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove after animation
        animation.onfinish = () => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        };
    }
}

// Play heart collection sound
function playHeartSound() {
    try {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Audio not supported - silent fail
    }
}

// Reset game function
function resetGame() {
    gameState = {
        heartsCollected: 0,
        totalHearts: 10,
        gameStarted: false,
        startTime: null,
        timerInterval: null,
        hearts: []
    };
    
    // Clear heart container
    if (heartContainer) {
        heartContainer.innerHTML = `
            <div class="start-placeholder">
                <i class="fas fa-heartbeat"></i>
                <p>Click "Play Again" to start a new game!</p>
            </div>
        `;
    }
    
    // Reset start button
    if (startButton) {
        startButton.disabled = false;
        startButton.innerHTML = '<i class="fas fa-play-circle"></i> Start Game';
        startButton.style.background = 'linear-gradient(135deg, #ff6b9d, #ff4081)';
        startButton.onclick = startGame;
    }
    
    // Hide special message
    if (specialMessageSection) {
        specialMessageSection.style.display = 'none';
    }
    
    // Reset displays
    updateHeartsDisplay();
    updateTimerDisplay();
    updateProgressBar();
    
    console.log('Game reset!');
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameState,
        startGame,
        collectHeart,
        resetGame
    };
      }
