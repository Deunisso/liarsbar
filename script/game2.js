document.addEventListener("DOMContentLoaded", function () {
    // Criação da tela de introdução
    let introScreen = document.createElement("div");
    introScreen.id = "intro-screen";
    introScreen.innerHTML = `
        <div class="intro-content">
            <p>DEVIL</p><br>
            <p>Deck Contains</p>
            <p>6x Ace's</p>
            <p>6x King's</p>
            <p>6x Queen's</p>
            <p>2x Joker's</p>
        </div>
    `;
    document.body.appendChild(introScreen);

    // Referências aos elementos da tela de jogo e carta
    let gameContainer = document.getElementById("game-container");
    let roundCard = document.getElementById("round-card"); 

    // Esconde a tela do jogo e a carta inicialmente
    if (gameContainer) gameContainer.style.display = "none";
    if (roundCard) {
        roundCard.style.opacity = "0"; // Inicialmente a carta está invisível
        roundCard.style.visibility = "hidden"; // A carta não é interativa
    }

    // Após 2 segundos, remove a tela de introdução e exibe a carta
    setTimeout(() => {
        introScreen.style.opacity = "0"; // Apaga a tela de introdução
        setTimeout(() => {
            introScreen.remove(); // Remove a tela de introdução do DOM

            // Exibe o conteúdo do jogo
            if (gameContainer) gameContainer.style.display = "block";

            // Torna a carta visível e interativa
            if (roundCard) {
                roundCard.style.opacity = "1"; // Torna a carta visível
                roundCard.style.visibility = "visible"; // Torna a carta interativa
                click.play();
            }
        }, 500); // Aguarda meio segundo para remover a tela
    }, 3000); // Aguardar 2 segundos antes de exibir a carta
});

let players = [true, true, true, true];
let attempts = [0, 0, 0, 0];
let isPlaying = false;
let cardImages = ['images/q2.png', 'images/k2.png', 'images/a2.png',];
let cardNames = {
    'images/q2.png': `<span class="queen">QUEEN'S</span> <span>TABLE ❤️</span>`,
    'images/k2.png': `<span class="king">KING'S</span> <span>TABLE ❤️</span>`,
    'images/a2.png': `<span class="ace">ACE'S</span> <span>TABLE ❤️</span>`,
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

        if (currentCard.includes("a2.png")) {
            audioA.currentTime = 0;
            audioA.play();
        } else if (currentCard.includes("k2.png")) {
            audioK.currentTime = 0;
            audioK.play();
        } else if (currentCard.includes("q2.png")) {
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
                start.play();
                reload.play();
            }, 100);
        }, 2000);
    }, 2000);
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

                    resetGame();
                }, 3000);
            }
            isPlaying = false;
        }, 1000);
    }, 1000);
}

function resetGame() {
    // Criação da tela de introdução
    let introScreen = document.createElement("div");
    introScreen.id = "intro-screen";
    introScreen.innerHTML = `
        <div class="intro-content">
            <p>DEVIL</p><br>
            <p>Deck Contains</p>
            <p>6x Ace's</p>
            <p>6x King's</p>
            <p>6x Queen's</p>
            <p>2x Joker's</p>
        </div>
    `;
    document.body.appendChild(introScreen);

    // Referências aos elementos da tela de jogo e carta
    let gameContainer = document.getElementById("game-container");
    let roundCard = document.getElementById("round-card"); 

    // Esconde a tela do jogo e a carta inicialmente
    if (gameContainer) gameContainer.style.display = "none";
    if (roundCard) {
        roundCard.style.opacity = "0"; // Inicialmente a carta está invisível
        roundCard.style.visibility = "hidden"; // A carta não é interativa
    }

    // Após 2 segundos, remove a tela de introdução e exibe a carta
    setTimeout(() => {
        introScreen.style.opacity = "0"; // Apaga a tela de introdução
        setTimeout(() => {
            introScreen.remove(); // Remove a tela de introdução do DOM

            // Exibe o conteúdo do jogo
            if (gameContainer) gameContainer.style.display = "block";

            // Torna a carta visível e interativa
            if (roundCard) {
                roundCard.style.opacity = "1"; // Torna a carta visível
                roundCard.style.visibility = "visible"; // Torna a carta interativa
                click.play();
            }
        }, 500); // Aguarda meio segundo para remover a tela
    }, 2000); // Aguardar 2 segundos antes de exibir a carta

    players = [true, true, true, true];
    attempts = [0, 0, 0, 0];
    isPlaying = false;
    hasSpun = false;

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

    let cardElement = document.getElementById("round-card");
    let cardImage = document.getElementById("card-image");
    cardImage.src = 'images/back.png';
    cardElement.style.display = 'flex';

    let hiddenContainer = document.querySelector(".container");
    hiddenContainer.style.display = "none";
    hiddenContainer.classList.remove("show");

    let cardNameContainer = document.getElementById("card-name-container");
    cardNameContainer.classList.remove("show"); 

    let reload = document.getElementById("reload");
    let start = document.getElementById("start");
    reload.currentTime = 0;
    start.currentTime = 0;

    cardElement.onclick = function () {
        spinCard();

        setTimeout(() => {
            let maxScore = Math.max(...scores);
            let leaderIndices = scores.map((score, i) => score === maxScore ? i : -1).filter(i => i !== -1);

            if (leaderIndices.length > 0) {
                let leaderAudios = leaderIndices.map(index => {
                    let leaderName = playerNames[index];
                    let normalizedLeaderName = leaderName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return new Audio(`./audios/${normalizedLeaderName}.mp3`);
                });

                let leaderMessage;
                if (leaderAudios.length === 1) {
                    leaderMessage = new Audio("./audios/esta_na_lideranca.mp3");
                } else {
                    leaderMessage = new Audio("./audios/estao_na_lideranca.mp3");
                }

                let audioE = new Audio("./audios/e.mp3");

                function playSequence(index) {
                    if (index >= leaderAudios.length) {
                        setTimeout(() => leaderMessage.play(), 250);
                        return;
                    }

                    leaderAudios[index].play();

                    if (index === leaderAudios.length - 2 && leaderAudios.length > 1) {
                        leaderAudios[index].onended = () => {
                            audioE.play();
                            audioE.onended = () => {
                                playSequence(index + 1);
                            };
                        };
                    } else {
                        leaderAudios[index].onended = () => playSequence(index + 1);
                    }
                }

                playSequence(0);
            }
        }, 8000); 
    };

    // Alternando aleatoriamente entre os modos de jogo
    const modes = ['game.html', 'game2.html', 'game3.html'];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    window.location.href = randomMode; // Redireciona para o novo modo de jogo
}
