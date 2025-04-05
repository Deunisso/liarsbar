document.addEventListener("DOMContentLoaded", function () {
    let startAudio = document.getElementById("start");
    let music = document.getElementById("music");

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

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    if (!mode || !["basic", "devil", "chaos"].includes(mode)) {
        window.location.href = 'gamemodes.html';
        return;
    }

    const gameModes = {
        basic: {
            image: "./images/basic.png",
            cardBack: "./images/back.png",
            deckInfo: ["6x Clubs", "6x Hearts", "6x Spades", "2x Joker's"],
            buttons: [],
            music: "./audios/basic.mp3"
        },

        devil: {
            image: "./images/devil.png",
            cardBack: "./images/back2.png",
            deckInfo: ["6x Clubs", "6x Hearts", "6x Spades", "2x Joker's"],
            buttons: [{ id: "devilButton", text: "DEVIL", class: "devil" }],
            music: "./audios/devil.mp3"
        },

        chaos: {
            image: "./images/chaos.png",
            cardBack: "./images/back3.png",
            deckInfo: ["5x Clubs", "5x Spades", "1x Chaos (A)", "1x Master (10)"],
            buttons: [
                { id: "devilButton", text: "CHAOS", class: "devil" },
                { id: "masterButton", text: "MASTER", class: "master" }
            ],
            music: "./audios/chaos.mp3"
        }
    };

    const cardSets = {
        basic: [cardImages[0], cardImages[1], cardImages[2]],
        devil: [cardImages[3], cardImages[4], cardImages[5]],
        chaos: [cardImages[6], cardImages[7]]
    };

    const gameConfig = gameModes[mode];

    document.getElementById("game-image").src = gameConfig.image;
    document.getElementById("card-image").src = gameConfig.cardBack;

    const deckInfoContainer = document.getElementById("deck-info");
    deckInfoContainer.innerHTML = gameConfig.deckInfo.map(item => `<p>${item}</p>`).join("");

    const buttonsContainer = document.getElementById("buttons-container");
    buttonsContainer.innerHTML = "";
    gameConfig.buttons.forEach(btn => {
        const button = document.createElement("button");
        button.id = btn.id;
        button.className = `action-button ${btn.class}`;
        button.textContent = btn.text;
        buttonsContainer.appendChild(button);
        
        button.addEventListener("click", () => {
            playButtonAudio(btn.text);
        });
    });

    music.src = gameConfig.music;
    music.load();
    music.play();

    updateCurrentCards(cardSets[mode]);

    toggleMusic();

    let currentAudio = null; 

    function playButtonAudio(buttonText) {
        let audio;
        if (buttonText === "DEVIL") {
            audio = document.getElementById("devil-button");
        } else if (buttonText === "CHAOS") {
            audio = document.getElementById("chaos-button");
        } else if (buttonText === "MASTER") {
            audio = document.getElementById("master-button");
        }

        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        if (audio) {
            currentAudio = audio;
            audio.play();
        }
    }
});

function resetGame() {
    const gamemode = 'gamemodes.html';

    setTimeout(() => {
        window.location.href = gamemode;
    }, 3000);
}


function saveScores() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

function loadScores() {
    let storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores) {
        scores = storedScores;
        playerNames.forEach((name, i) => {
            document.getElementById(`score${i + 1}`).innerText = scores[i];
        });
    }
}

let selectedPlayers = [];

function enablePlayerButtons() {
    document.querySelectorAll("#devilButton, #masterButton, #players-container button").forEach(button => {
        button.classList.remove("disabled");
        button.style.pointerEvents = "auto";
        button.removeAttribute("disabled");
    });
}

function disablePlayerButtons() {
    document.querySelectorAll("#devilButton, #masterButton, #players-container button").forEach(button => {
        button.classList.add("disabled");
        button.style.pointerEvents = "none";
        button.setAttribute("disabled", "true");
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

let playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];
let players = [true, true, true, true];
let hasSpun = false;
let isPlaying = false;
let attempts = [0, 0, 0, 0];
let scores = [0, 0, 0, 0];
let currentCard = '';

let cardImages = ['images/clubs.png', 'images/hearts.png', 'images/spades.png',
    'images/aceClubs.png', 'images/aceHearts.png', 'images/aceSpades.png',
    'images/clubs.png', 'images/spades.png',];

let cardNames = {
    'images/clubs.png': `<span class="queen">CLUBS</span> <span>TABLE</span>`,
    'images/hearts.png': `<span class="king">HEARTS</span> <span>TABLE</span>`,
    'images/spades.png': `<span class="ace">SPADES</span> <span>TABLE</span>`,
    'images/aceClubs.png': `<span class="queen">ACE OF CLUBS</span> <span>TABLE</span>`,
    'images/aceHearts.png': `<span class="king">ACE OF HEARTS</span> <span>TABLE</span>`,
    'images/aceSpades.png': `<span class="ace">ACE OF SPADES</span> <span>TABLE</span>`,
    'images/clubs.png': `<span class="queen">CLUBS</span> <span>TABLE</span>`,
    'images/spades.png': `<span class="ace">SPADES</span> <span>TABLE</span>`,
};

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
};

toggleMusic();

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

window.gameState = {
    currentCards: [cardImages[0], cardImages[1], cardImages[2],]
};

function updateCurrentCards(newCards) {
    window.gameState.currentCards = newCards;
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

    let currentCards = window.gameState.currentCards;

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

        if (currentCard.includes("clubs.png")) {
            audioA.currentTime = 0;
            audioA.play();
        } else if (currentCard.includes("hearts.png")) {
            audioK.currentTime = 0;
            audioK.play();
        } else if (currentCard.includes("spades.png")) {
            audioQ.currentTime = 0;
            audioQ.play();
        } else if (currentCard.includes("clubs.png")) {
            audioA.currentTime = 0;
            audioA.play();
        } else if (currentCard.includes("hearts.png")) {
            audioK.currentTime = 0;
            audioK.play();
        } else if (currentCard.includes("spades.png")) {
            audioQ.currentTime = 0;
            audioQ.play();
        } else if (currentCard.includes("clubs.png")) {
            audioA.currentTime = 0;
            audioA.play();
        } else if (currentCard.includes("spades.png")) {
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
                let buttonsContainer = document.querySelector(".buttons-container");
                if (buttonsContainer) {
                    buttonsContainer.classList.add("show");
                }
                cardNameContainer.classList.add("show");

                hiddenContainer.classList.add("show");
                reload.play();
            }, 100);
        }, 2000);
    }, 2000);
};

displayPlayers();

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

                    let winnerIndex = players.findIndex(p => p);
                    let winnerNameAudio = document.getElementById(`audio${normalizeName(playerNames[winnerIndex])}`);
                    let venceuAudio = document.getElementById("venceu");

                    if (winnerNameAudio) {
                        winnerNameAudio.play();
                    }

                    setTimeout(() => {
                        if (venceuAudio) {
                            venceuAudio.play();
                        }
                    }, winnerNameAudio ? 1000 : 0);
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
