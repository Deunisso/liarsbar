click.play();
let players = [true, true, true, true];
let attempts = [0, 0, 0, 0];
let isPlaying = false;
let cardImages = ['images/q.png', 'images/k.png', 'images/a.png'];
let cardNames = {
    'images/q.png': `<span class="queen">QUEEN'S</span> <span>TABLE</span>`,
    'images/k.png': `<span class="king">KING'S</span> <span>TABLE</span>`,
    'images/a.png': `<span class="ace">ACE'S</span> <span>TABLE</span>`
};
let currentCard = '';
let scores = [0, 0, 0, 0];  // Array para armazenar a pontuação

function shufflePlayers() {
    // Recupera os jogadores salvos no localStorage
    let storedPlayers = JSON.parse(localStorage.getItem("players"));
    if (storedPlayers) {
        playerNames = storedPlayers;
    }

    // Embaralha os jogadores
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

    let interval = setInterval(() => {
        cardImage.src = cardImages[index % cardImages.length];
        cardElement.style.transform = `translate(-50%, -50%) rotateY(${index * 60}deg)`;
        index++;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        cardSpinSound.pause();
        cardSpinSound.currentTime = 0;

        // Sorteia uma carta aleatória
        currentCard = cardImages[Math.floor(Math.random() * cardImages.length)];
        cardImage.src = currentCard;
        cardElement.style.transform = "translate(-50%, -50%) rotateY(0deg)";

        // Toca o som correspondente à carta sorteada
        if (currentCard.includes("A")) {
            audioA.play();
        } else if (currentCard.includes("K")) {
            audioK.play();
        } else if (currentCard.includes("Q")) {
            audioQ.play();
        }

        setTimeout(() => {
            cardElement.style.display = 'none';

            hiddenContainer.style.display = "flex";
            setTimeout(() => {
                // Exibe o nome da carta sorteada
                let cardName = cardNames[currentCard];
                let cardNameContainer = document.getElementById("card-name-container");

                // Atualiza o nome da carta
                cardNameContainer.innerHTML = cardName;

                // Adiciona a classe 'show' para iniciar a transição de fade
                cardNameContainer.classList.add("show");

                hiddenContainer.classList.add("show");
                reload.play();
                start.play();
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
            gunShot.play();  // Toca o áudio do tiro primeiro
            button.classList.add("dead");
            players[index] = false;
            icon.src = "images/morto.png";

            let normalizedPlayerName = normalizeName(playerNames[index]);
            let deathAudio = document.getElementById(`audio${normalizedPlayerName}`);
            let seLascouAudio = new Audio("./audios/se_lascou.mp3");

            // Toca o áudio do nome do jogador após 3 segundos do gunShot
            setTimeout(() => {
                if (deathAudio) {
                    deathAudio.play();
                    deathAudio.onended = () => {
                        setTimeout(() => {
                            // Toca "se_lascou" após o áudio do nome
                            seLascouAudio.play();
                        }, 100); // Pequeno delay antes de tocar "se_lascou"
                    };
                }
            }, 500);
        } else {
            surviveSound.play();
        }

        setTimeout(() => {
            if (players.filter(p => p).length === 1) {
                setTimeout(() => {
                    winSound.play();  // Som de vitória com delay
                }, 2000);  // Delay de 1 segundo para o som de vitória

                setTimeout(() => {
                    // Atribui 1 ponto aos sobreviventes
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
    click.play();
    players = [true, true, true, true];
    attempts = [0, 0, 0, 0];
    isPlaying = false;
    hasSpun = false;

    // Carrega os pontos dos jogadores do localStorage
    loadScoresFromLocalStorage();

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

    // Adicionando para esconder o nome do card durante o reset
    let cardNameContainer = document.getElementById("card-name-container");
    cardNameContainer.classList.remove("show"); // Remove a classe 'show' para esconder o nome

    let reload = document.getElementById("reload");
    let start = document.getElementById("start");
    reload.currentTime = 0;
    start.currentTime = 0;

    // Adiciona evento ao clique na carta
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
                        setTimeout(() => leaderMessage.play(), 250); // Pequeno atraso antes da frase final
                        return;
                    }

                    leaderAudios[index].play();

                    // Se for penúltimo jogador e houver mais de um, tocar "e"
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
        }, 8000); // Tempo de espera antes de tocar os áudios
    };
}
