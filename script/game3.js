document.addEventListener("DOMContentLoaded", function () {
    let introScreen = document.createElement("div");
    introScreen.id = "intro-screen";
    introScreen.innerHTML = `
        <div class="intro-content">
            <p>CHAOS</p><br>
            <p>Deck Contains</p>
            <p>5x King's</p>
            <p>5x Queen's</p>
            <p>1x Chaos (10)</p>
            <p>1x Master (A)</p>
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
    start.play();
});

document.addEventListener("DOMContentLoaded", function () {
    let chaosButton = document.getElementById("chaosButton");
    if (chaosButton) {
        chaosButton.onclick = openChaosModal;
    }
});

let selectedPlayers = [];

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

function openChaosModal() {
    let modal = document.createElement("div");
    modal.id = "chaos-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Selecione os jogadores para CHAOS</h2>
            <div id="player-selection">
                ${playerNames.map((name, i) => `
                    <div id="player-btn-${i}" class="player-button" onclick="togglePlayerSelection(${i})">${name}</div>
                `).join('')}
            </div>
            <div class="execute-container">
                <div class="player-button execute" onclick="executeChaos()">Executar</div>
                <div class="player-button cancel" onclick="closeChaosModal()">Cancelar</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    initializeSelectedPlayers();
}

function executeChaos() {
    playChaos(selectedPlayers);
    closeChaosModal();
}

function closeChaosModal() {
    let modal = document.getElementById("chaos-modal");
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300); // 
    }
}

function playChaos(indices) {
    if (indices.length === 0) return;

    function playSequential(index, delay) {
        setTimeout(() => {
            if (!players[index] || attempts[index] >= 6) return;  // Acesso à variável global attempts

            let button = document.getElementById(`p${index + 1}`);
            let icon = document.getElementById(`i${index + 1}`);
            let gunShot = document.getElementById("gunShot");
            let surviveSound = document.getElementById("surviveSound");

            let alivePlayers = players.filter(p => p).length;

            if (alivePlayers === 1) {
                return;
            }

            attempts[index]++;  // Modificando a variável global attempts
            icon.src = `images/vida${attempts[index]}.png`;

            let morte = attempts[index] >= 6 || Math.random() < 1 / 6;

            if (morte) {
                gunShot.play();
                button.classList.add("dead");
                players[index] = false;
                icon.src = "images/morto.gif";
                let ouch = new Audio("./audios/ouch.mp3");

                setTimeout(() => {
                    if (ouch) {
                        ouch.play();
                    }
                }, 500);
            } else {
                surviveSound.play();
            }

            if (players.filter(p => p).length === 1) {
                setTimeout(() => {
                    winSound.play();
                    players.forEach((alive, i) => {
                        if (alive) {
                            scores[i]++;
                        }
                    });
                    resetGame();
                }, 3000);
                return;
            }

        }, delay);
    }

    indices.forEach((index, i) => {
        playSequential(index, i * 1000);
    });

    isPlaying = false;
}

let players = [true, true, true, true];
let attempts = [0, 0, 0, 0];
let isPlaying = false;
let cardImages = ['images/q.png', 'images/k.png',];
let cardNames = {
    'images/q.png': `<span class="queen">QUEEN'S</span> <span>TABLE</span>`,
    'images/k.png': `<span class="king">KING'S</span> <span>TABLE</span>`,
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
    let audioK = new Audio("./audios/audioK.mp3");
    let audioQ = new Audio("./audios/audioQ.mp3");
    let index = 0;

    cardSpinSound.play();

    shuffleCards();

    let currentCards = [cardImages[0], cardImages[1]];

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

        if (currentCard.includes("k.png")) {
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
                let buttonsContainer = document.querySelector(".buttons-container");
                if (buttonsContainer) {
                    buttonsContainer.classList.add("show");
                }
                cardNameContainer.innerHTML = cardName;

                cardNameContainer.classList.add("show");
                hiddenContainer.classList.add("show");
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

    setTimeout(() => {
        attempts[index]++;  // Modificando a variável global attempts
        icon.src = `images/vida${attempts[index]}.png`;

        let morte = attempts[index] >= 6 || Math.random() < 1 / 6;

        if (morte) {
            gunShot.play();
            button.classList.add("dead");
            players[index] = false;
            icon.src = "images/morto.gif";

            function normalizeName(name) {
                return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }

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
            if (players.filter(p => p).length <= 1) {
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

document.addEventListener("DOMContentLoaded", function () {
    let masterButton = document.getElementById("masterButton");
    if (masterButton) {
        masterButton.onclick = openMasterModal;
    }
});

function openMasterModal() {
    let modal = document.createElement("div");
    modal.id = "master-modal";

    // Filtra os jogadores vivos para mostrar no select
    let alivePlayers = players.map((alive, i) => alive ? i : -1).filter(i => i !== -1);

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Selecione o jogador ATIRADOR e o jogador ALVO</h2>
            <div id="player-selection">
                <label for="shooter">Atirador:</label>
                <select id="shooter">
                    ${alivePlayers.map(index => `<option value="${index}">${playerNames[index]}</option>`).join('')}
                </select>
                <select id="target">
                    ${alivePlayers.map(index => `<option value="${index}">${playerNames[index]}</option>`).join('')}
                </select>
            </div>
            <div class="execute-container">
                <div class="player-button execute" onclick="executeMaster()">Executar</div>
                <div class="player-button cancel" onclick="closeMasterModal()">Cancelar</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeMasterModal() {
    let modal = document.getElementById("master-modal");
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function executeMaster() {
    let shooterIndex = parseInt(document.getElementById("shooter").value);
    let targetIndex = parseInt(document.getElementById("target").value);

    // Verifica se o atirador e o alvo são diferentes e estão vivos
    if (players[shooterIndex] && players[targetIndex] && shooterIndex !== targetIndex) {
        playMaster(shooterIndex, targetIndex);
    } else {
        // Alerta ou ação caso o atirador ou alvo sejam inválidos
        alert("Seleção inválida. O atirador e o alvo devem ser diferentes e ambos vivos.");
    }

    closeMasterModal();
}

function playMaster(shooterIndex, targetIndex) {
    // Verifica se o atirador ou o alvo estão mortos, ou se a munição do atirador acabou
    if (!players[shooterIndex] || !players[targetIndex] || attempts[shooterIndex] >= 6 || shooterIndex === targetIndex) return;

    let shooterButton = document.getElementById(`p${shooterIndex + 1}`);
    let targetButton = document.getElementById(`p${targetIndex + 1}`);
    let shooterIcon = document.getElementById(`i${shooterIndex + 1}`);
    let targetIcon = document.getElementById(`i${targetIndex + 1}`);
    let gunShot = document.getElementById("gunShot");
    let surviveSound = document.getElementById("surviveSound");

    // Incrementa a tentativa do atirador
    attempts[shooterIndex]++;
    shooterIcon.src = `images/vida${attempts[shooterIndex]}.png`;

    // Chance de matar o alvo
    let killChance = Math.random() < 1 / 6;

    if (killChance) {
        gunShot.play();
        players[targetIndex] = false;
        targetIcon.src = "images/morto.gif";
        targetButton.classList.add("dead");

        // Resetando a munição do atirador se ele matar o alvo
        attempts[shooterIndex] = 0;
        shooterIcon.src = `images/vida0.png`;

        setTimeout(() => {
            let ouch = new Audio("./audios/ouch.mp3");
            ouch.play();
        }, 500);
    } else {
        surviveSound.play();
    }

    // Checa se existe apenas um jogador vivo
    if (players.filter(p => p).length === 1) {
        setTimeout(() => {
            winSound.play();
            players.forEach((alive, i) => {
                if (alive) {
                    scores[i]++;
                }
            });
            resetGame();
        }, 3000);
    }
}

function resetGame() {
    let buttonsContainer = document.querySelector(".buttons-container");
    if (buttonsContainer) buttonsContainer.classList.remove("show");

    let introScreen = document.createElement("div");
    introScreen.id = "intro-screen";
    introScreen.innerHTML = `
        <div class="intro-content">
            <p>CHAOS</p><br>
            <p>Deck Contains</p>
            <p>5x King's</p>
            <p>5x Queen's</p>
            <p>1x Chaos (10)</p>
            <p>1x Master (A)</p>
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

            let cardNameContainer = document.getElementById("card-name-container");
            let playersContainer = document.getElementById("players-container");
            if (cardNameContainer) cardNameContainer.style.display = "block";
            if (playersContainer) playersContainer.style.display = "block";
        }, 500);
    }, 3000);
    start.play();

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
                    let normalizedLeaderName = leaderName.normalize("NFD").replace(/[̀-ͯ]/g, "");
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

    const gamemode = 'gamemodes.html';
    window.location.href = gamemode;
}
