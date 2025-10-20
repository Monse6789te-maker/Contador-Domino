// Sonidos usando Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'point') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'win') {
        // Melodía de victoria
        const notes = [523.25, 659.25, 783.99]; // Do, Mi, Sol
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.3);
            }, i * 150);
        });
    } else if (type === 'champion') {
        // Fanfarria de campeón
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do alto
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.4, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.5);
            }, i * 200);
        });
    }
}

let game = {
    team1: { points: 0, gamesWon: 0 },
    team2: { points: 0, gamesWon: 0 },
    history: [],
    gameFinished: false
};

function addPoints(team) {
    if (game.gameFinished) {
        alert('¡El juego ha terminado! Reinicia para comenzar uno nuevo.');
        return;
    }

    const input = document.getElementById(`input${team}`);
    const points = parseInt(input.value);
    
    if (!points || points < 0) {
        alert('Por favor ingresa un número válido de puntos');
        return;
    }
    
    game[`team${team}`].points += points;
    
    playSound('point'); // Sonido al sumar puntos
    
    const timestamp = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    game.history.push(`${timestamp} - Equipo ${team} perdió y sumó ${points} puntos`);
    
    animatePoints(team);
    updateDisplay();
    input.value = '';
    
    checkGameWin(team);
}

function animatePoints(team) {
    const pointsEl = document.getElementById(`points${team}`);
    pointsEl.classList.add('animate');
    setTimeout(() => pointsEl.classList.remove('animate'), 500);
}

function createConfetti() {
    const colors = ['#3b82f6', '#f97316', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

function checkGameWin(losingTeam) {
    const losingTeamData = game[`team${losingTeam}`];
    
    if (losingTeamData.points >= 50) {
        const winningTeam = losingTeam === 1 ? 2 : 1;
        game[`team${winningTeam}`].gamesWon++;
        
        game.history.push(`🏆 ¡Equipo ${winningTeam} ganó el juego! (Equipo ${losingTeam} llegó a ${losingTeamData.points} puntos)`);
        
        game.team1.points = 0;
        game.team2.points = 0;
        
        playSound('win'); // Sonido al ganar un juego
        createConfetti();
        updateDisplay();
        
        if (game[`team${winningTeam}`].gamesWon >= 2) {
            finishMatch(winningTeam);
        } else {
            setTimeout(() => {
                alert(`¡Equipo ${winningTeam} ganó este juego! Comienza el siguiente juego.`);
            }, 500);
        }
    }
}

function finishMatch(winningTeam) {
    game.gameFinished = true;
    game.history.push(`🎉 ¡¡¡EQUIPO ${winningTeam} GANÓ LA PARTIDA!!!`);
    updateDisplay();
    playSound('champion'); // Sonido de campeón
    createConfetti();
    
    setTimeout(() => {
        alert(`🎉 ¡¡¡EQUIPO ${winningTeam} ES EL CAMPEÓN!!! 🎉`);
    }, 500);
}

function updateDisplay() {
    document.getElementById('points1').textContent = game.team1.points;
    document.getElementById('points2').textContent = game.team2.points;
    
    for (let i = 1; i <= 2; i++) {
        document.getElementById(`team${i}-game1`).classList.toggle('won', game[`team${i}`].gamesWon >= 1);
        document.getElementById(`team${i}-game2`).classList.toggle('won', game[`team${i}`].gamesWon >= 2);
    }
    
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = game.history.map(item => 
        `<div class="history-item">${item}</div>`
    ).reverse().join('') || '<div class="history-item">El juego comenzará cuando añadas los primeros puntos</div>';
}

function showResetModal() {
    document.getElementById('modalOverlay').classList.add('active');
}

function hideResetModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function confirmReset() {
    game = {
        team1: { points: 0, gamesWon: 0 },
        team2: { points: 0, gamesWon: 0 },
        history: [],
        gameFinished: false
    };
    
    updateDisplay();
    hideResetModal();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const toggle = document.querySelector('.dark-mode-toggle');
    toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Cargar preferencia de modo oscuro
window.addEventListener('load', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-toggle').textContent = '☀️';
    }
});

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideResetModal();
    }
});

// Cerrar modal al hacer clic fuera
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        hideResetModal();
    }
});

updateDisplay();
```

---

## 📄 **.gitignore**
```
# Sistema operativo
.DS_Store
Thumbs.db
desktop.ini

# Editores
.vscode/
.idea/
*.swp
*.swo
*~
.project
.settings/
*.sublime-project
*.sublime-workspace

# Archivos temporales
*.log
*.tmp
*.temp
.cache/

# Node modules (si decides agregar un build process más adelante)
node_modules/
npm-debug.log
yarn-error.log
package-lock.json
yarn.lock

# Archivos de respaldo
*.bak
*.backup
*~

# Carpetas de distribución (si usas un bundler)
dist/
build/

# Variables de entorno
.env
.env.local
.env.development
.env.test
.env.production