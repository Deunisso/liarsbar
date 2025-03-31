function saveScores() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

document.addEventListener("DOMContentLoaded", function () {
    let startAudio = new Audio("./audios/start.mp3");
    startAudio.play();

    let savedScores = JSON.parse(localStorage.getItem("scores"));
    if (savedScores) {
        scores = savedScores; 
    }

    shufflePlayers();
});

document.addEventListener("DOMContentLoaded", function () {
    let startAudio = new Audio("./audios/start.mp3");
    startAudio.play();

    let introScreen = document.createElement("div");
    introScreen.id = "intro-screen";
    introScreen.innerHTML = `
        <div class="intro-content">
            <img src="./images/basic.png" alt="Basic" class="basic-intro-image"><br>
            <p>Deck Contains</p>
            <p>6x Ace's</p>
            <p>6x King's</p>
            <p>6x Queen's</p>
            <p>2x Joker's</p>
        </div>
    `;
    document.body.appendChild(introScreen);

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
            introScreen.remove();

            if (gameContainer) gameContainer.style.display = "block";

            if (roundCard) {
                roundCard.style.opacity = "1"; 
                roundCard.style.visibility = "visible";
            }
        }, 500); 
    }, 3000); 
});

let players = [true, true, true, true];
let attempts = [0, 0, 0, 0];
let isPlaying = false;
let cardImages = ['images/q.png', 'images/k.png', 'images/a.png',];
let cardNames = {
    'images/q.png': `<span class="queen">QUEEN'S</span> <span>TABLE</span>`,
    'images/k.png': `<span class="king">KING'S</span> <span>TABLE</span>`,
    'images/a.png': `<span class="ace">ACE'S</span> <span>TABLE</span>`,
};
let currentCard = '';
let scores = [0, 0, 0, 0];
let playerNames = ["Danilo", "Denilson", "Kauã", "Kaique"];

function shufflePlayers() {
    let storedPlayers = JSON.parse(localStorage.getItem("players"));
    if (storedPlayers) {
        playerNames = storedPlayers;
    }

    playerNames = playerNames.sort(() => Math.random() - 0.5);

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

let hasSpun = false;

let audioA = new Audio("./audios/audioA.mp3");
let audioK = new Audio("./audios/audioK.mp3");
let audioQ = new Audio("./audios/audioQ.mp3");

function shuffleCards() {
    for (let i = cardImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardImages[i], cardImages[j]] = [cardImages[j], cardImages[i]];
    }
}

function spinCard() {
    if (hasSpun) return;
    hasSpun = true;

    let cardElement = document.getElementById("round-card");
    let cardImage = document.getElementById("card-image");
    let cardSpinSound = document.getElementById("cardSpinSound");
    let hiddenContainer = document.querySelector(".container");
    let audioA = new Audio("./audios/audioA.mp3");
    let audioK = new Audio("./audios/audioK.mp3");
    let audioQ = new Audio("./audios/audioQ.mp3");
    let index = 0;

    cardSpinSound.play();

    shuffleCards();

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
            }, 100); // Este intervalo está fazendo a rotação da carta a cada 100 milissegundos, o que causa o efeito de giro.
        }, 2000); // Aqui, após a escolha da carta, a carta some da tela (display: none) e um outro contêiner (provavelmente para mostrar o resultado) é exibido (display: flex).
    }, 2000); // Aqui, a rotação da carta é interrompida e o som de rotação é pausado e resetado.
}

shufflePlayers();

function play(index) {
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
            let seLascouAudio = new Audio("./audios/se_lascou.mp3");

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

let musicToggle = document.getElementById("music-toggle");
let music = document.getElementById("music");

music.pause();

musicToggle.addEventListener("change", function() {
    if (musicToggle.checked) {
        music.play(); 
    } else {
        music.pause(); 
    }
});

function resetGame() {
    const gamemode = 'gamemodes.html';

    setTimeout(() => {
        window.location.href = gamemode;
    }, 3000);
}
