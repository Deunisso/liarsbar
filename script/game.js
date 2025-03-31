document.addEventListener("DOMContentLoaded", function () {
    let startAudio = document.getElementById("start");
    startAudio.play();
    loadScores();

    let introScreen = document.getElementById("intro-screen");
    let gameContainer = document.getElementById("game-container");
    let roundCard = document.getElementById("round-card");

    if (gameContainer) gameContainer.style.display = "none";
    if (roundCard) {
        roundCard.style.opacity = "0";
        roundCard.style.visibility = "hidden";
    }

    setTimeout(() => {
        introScreen.style.opacity = "0";
        setTimeout(() => {
            introScreen.style.display = "none";
            if (gameContainer) gameContainer.style.display = "block";

            if (roundCard) {
                roundCard.style.opacity = "1";
                roundCard.style.visibility = "visible";
            }
        }, 500);
    }, 3000);
});

function loadScores() {
    let storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores) {
        scores = storedScores;
        playerNames.forEach((name, i) => {
            document.getElementById(`score${i + 1}`).innerText = scores[i]; // Atualiza a pontuação no HTML
        });
    }
}

let playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];
let players = [true, true, true, true];
let hasSpun = false;
let isPlaying = false;
let attempts = [0, 0, 0, 0];
let scores = [0, 0, 0, 0];
let currentCard = '';

let cardImages = ['images/q.png', 'images/k.png', 'images/a.png',
                  'images/q2.png', 'images/k2.png', 'images/a2.png',
                  'images/q3.png', 'images/k3.png',];

let cardNames = {
    'images/q.png': `<span class="queen">QUEEN'S</span> <span>TABLE</span>`,
    'images/k.png': `<span class="king">KING'S</span> <span>TABLE</span>`,
    'images/a.png': `<span class="ace">ACE'S</span> <span>TABLE</span>`,
    'images/q2.png': `<span class="queen">QUEEN'S</span> <span>TABLE ❤️</span>`,
    'images/k2.png': `<span class="king">KING'S</span> <span>TABLE ❤️</span>`,
    'images/a2.png': `<span class="ace">ACE'S</span> <span>TABLE ❤️</span>`,
    'images/q3.png': `<span class="queen">QUEEN'S</span> <span>TABLE</span>`,
    'images/k3.png': `<span class="king">KING'S</span> <span>TABLE</span>`,
};

function resetGame() {
    const gamemode = 'gamemodes.html';

    setTimeout(() => {
        window.location.href = gamemode;
    }, 3000);
}

function toggleMusic() {
    let musicToggle = document.getElementById("music-toggle");
    let music = document.getElementById("music");

    music.pause();

    musicToggle.addEventListener("change", function () {
        if (musicToggle.checked) {
            music.play();
        } else {
            music.pause();
        }
    });
}; toggleMusic();

function displayPlayers() {
    let storedPlayers = JSON.parse(localStorage.getItem("players"));
    if (storedPlayers) {
        playerNames = storedPlayers;
    }

    let container = document.getElementById("players-container");
    container.innerHTML = "";
    playerNames.forEach((name, i) => {
        container.innerHTML += `
            <button class="player alive" id="p${i + 1}" onclick="play(${i})">
                <div class="info">
                    <img src="images/vida0.png" class="status-icon" id="i${i + 1}">
                    <span>${name}</span>
                    <span class="score" id="score${i + 1}">${scores[i]}</span> 
                </div>
            </button>
        `;
    });
}

function spinCard() {
    if (hasSpun) return;
    hasSpun = true;

    let cardElement = document.getElementById("round-card");
    let cardImage = document.getElementById("card-image");
    let cardSpinSound = document.getElementById("cardSpinSound");
    let hiddenContainer = document.querySelector(".container");
    let audioA = document.getElementById("audioA");
    let audioK = document.getElementById("audioK");
    let audioQ = document.getElementById("audioQ");
    let index = 0;

    cardSpinSound.play();

    let currentCards = [cardImages[0], cardImages[1], cardImages[2],];

    let interval = setInterval(() => {
        cardImage.src = currentCards[index % currentCards.length];
        cardElement.style.transform = `translate(-50%, -50%) rotateY(${index * 60}deg)`;
        index++;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        cardSpinSound.pause();
        cardSpinSound.currentTime = 0;

        currentCard = currentCards[Math.floor(Math.random() * currentCards.length)];
        cardImage.src = currentCard;
        cardElement.style.transform = "translate(-50%, -50%) rotateY(0deg)";

        if (currentCard.includes("a.png")) {
            audioA.currentTime = 0;
            audioA.play();
        } else if (currentCard.includes("k.png")) {
            audioK.currentTime = 0;
            audioK.play();
        } else if (currentCard.includes("q.png")) {
            audioQ.currentTime = 0;
            audioQ.play();
        } else if (currentCard.includes("a2.png")) {
            audioA.currentTime = 0;
            audioA.play();
        } else if (currentCard.includes("k2.png")) {
            audioK.currentTime = 0;
            audioK.play();
        } else if (currentCard.includes("q2.png")) {
            audioQ.currentTime = 0;
            audioQ.play();
        } else if (currentCard.includes("k3.png")) {
            audioK.currentTime = 0;
            audioK.play();
        } else if (currentCard.includes("q3.png")) {
            audioQ.currentTime = 0;
            audioQ.play();
        }

        setTimeout(() => {
            cardElement.style.display = 'none';
            hiddenContainer.style.display = "flex";

            setTimeout(() => {
                let cardName = cardNames[currentCard];
                let cardNameContainer = document.getElementById("card-name-container");
                cardNameContainer.innerHTML = cardName;

                cardNameContainer.classList.add("show");

                hiddenContainer.classList.add("show");
                reload.play();
            }, 100);
        }, 2000);
    }, 2000);
}; displayPlayers();

function saveScores() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

function play(index) {
    if (players.filter(p => p).length === 1) {
        players.forEach((alive, i) => {
            if (alive) {
                let button = document.getElementById(`p${i + 1}`);
                button.disabled = true;
            }
        });
    }

    if (!players[index] || attempts[index] >= 6 || isPlaying) return;

    isPlaying = true;

    let button = document.getElementById(`p${index + 1}`);
    let icon = document.getElementById(`i${index + 1}`);
    let clickSound = document.getElementById("clickSound");
    let gunShot = document.getElementById("gunShot");
    let winSound = document.getElementById("winSound");
    let surviveSound = document.getElementById("surviveSound");

    clickSound.play();

    function normalizeName(name) {
        return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    setTimeout(() => {
        attempts[index]++;
        icon.src = `images/vida${attempts[index]}.png`;

        let morte = attempts[index] >= 6 || Math.random() < 1 / 6;

        if (morte) {
            gunShot.play();
            button.classList.add("dead");
            players[index] = false;
            icon.src = "images/morto.gif";

            let normalizedPlayerName = normalizeName(playerNames[index]);
            let deathAudio = document.getElementById(`audio${normalizedPlayerName}`);
            let seLascouAudio = document.getElementById("seLascou");

            setTimeout(() => {
                if (deathAudio) {
                    deathAudio.play();
                    deathAudio.onended = () => {
                        setTimeout(() => {
                            seLascouAudio.play();
                        }, 100);
                    };
                }
            }, 500);
        } else {
            surviveSound.play();
        }

        setTimeout(() => {
            if (players.filter(p => p).length === 1) {
                setTimeout(() => {
                    winSound.play();
                }, 2000);

                setTimeout(() => {
                    players.forEach((alive, i) => {
                        if (alive) {
                            scores[i]++;
                            document.getElementById(`score${i + 1}`).innerText = scores[i]; // Atualiza a pontuação no HTML
                        }
                    });
                    saveScores();
                    resetGame();
                }, 3000);
            }
            isPlaying = false;
        }, 1000);
    }, 1000);
}

// ---------- ---------- ---------- MODO DEVIL ---------- ----------  ---------- //
document.addEventListener("DOMContentLoaded", function () {
    let devilButton = document.getElementById("devilButton");
    if (devilButton) {
        devilButton.onclick = openDevilModal;
    }
});

let selectedPlayers = [];

function disablePlayerButtons() {
    document.querySelectorAll(".player-button, #devilButton, #players-container button").forEach(button => {
        button.classList.add("disabled"); 
        button.style.pointerEvents = "none"; 
        button.setAttribute("disabled", "true"); 
    });
}

function enablePlayerButtons() {
    document.querySelectorAll(".player-button, #devilButton, #players-container button").forEach(button => {
        button.classList.remove("disabled");
        button.style.pointerEvents = "auto"; 
        button.removeAttribute("disabled"); 
    });
}

function initializeSelectedPlayers() {
    selectedPlayers = players.map((alive, index) => alive ? index : -1).filter(index => index !== -1);

    selectedPlayers.forEach(index => {
        const button = document.getElementById(`player-btn-${index}`);
        if (button) {
            button.classList.add("selected");
        }
    });
}

function togglePlayerSelection(index) {
    const button = document.getElementById(`player-btn-${index}`);

    if (players[index]) {
        if (selectedPlayers.includes(index)) {
            selectedPlayers = selectedPlayers.filter(i => i !== index);
            button.classList.remove("selected");
        } else {
            selectedPlayers.push(index);
            button.classList.add("selected");
        }
    }
}

function openDevilModal() {
    let modal = document.createElement("div");
    modal.id = "devil-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <div id="player-selection">
                ${playerNames.map((name, i) => `
                    <div id="player-btn-${i}" class="player-button" onclick="togglePlayerSelection(${i})">${name}</div>
                `).join('')}
            </div>
            <div class="execute-container">
                <div class="player-button execute" onclick="executeDevil()">Executar</div>
                <div class="player-button cancel" onclick="closeDevilModal()">Cancelar</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    initializeSelectedPlayers();
}

let isDevilRunning = false; 

function executeDevil() {
    if (isDevilRunning) return; 

    isDevilRunning = true; 
    disablePlayerButtons(); 

    playDevil(selectedPlayers);
    closeDevilModal(); 

    let totalDelay = (selectedPlayers.length * 1400);

    setTimeout(() => {
        enablePlayerButtons(); 
        isDevilRunning = false; 
    }, totalDelay);
}

function closeDevilModal() {
    let modal = document.getElementById("devil-modal");
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function playDevil(indices) {
    if (indices.length === 0) return;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let shuffledIndices = [...indices];
    shuffleArray(shuffledIndices);

    function playSequential(index, delay) {
        setTimeout(() => {
            if (!players[index] || attempts[index] >= 6 || isPlaying) return;
            let button = document.getElementById(`p${index + 1}`);
            let icon = document.getElementById(`i${index + 1}`);
            let gunShot = document.getElementById("gunShot");
            let surviveSound = document.getElementById("surviveSound");

            let alivePlayers = players.filter(p => p).length;

            if (alivePlayers === 1) {
                return;
            }

            attempts[index]++;
            icon.src = `images/vida${attempts[index]}.png`;

            let morte = attempts[index] >= 6 || Math.random() < 1 / 6;

            if (morte) {
                gunShot.play();
                button.classList.add("dead");
                players[index] = false;
                icon.src = "images/morto.gif";
                let ouch = document.getElementById("ouch");

                setTimeout(() => {
                    if (ouch) {
                        ouch.play();
                    }
                }, 500);
            } else {
                surviveSound.play();
            }

            if (players.filter(p => p).length <= 1) {
                players.forEach((alive, i) => {
                    let button = document.getElementById(`p${i + 1}`);
                    if (button) {
                        button.disabled = true;
                    }
                });
            }

            if (players.filter(p => p).length === 1) {
                setTimeout(() => {
                    winSound.play();
                    players.forEach((alive, i) => {
                        if (alive) {
                            scores[i]++;
                        }
                    });
                    saveScores();
                    resetGame();
                }, 3000);
                return;
            }

        }, delay);
    }

    shuffledIndices.forEach((index, i) => {
        playSequential(index, i * 1500);
    });

    isPlaying = false;
}

// ---------- ---------- ---------- MODO CHAOS ---------- ----------  ---------- //
