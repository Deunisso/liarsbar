document.addEventListener("DOMContentLoaded", () => {
    let masterButton = document.getElementById("masterButton");

    if (masterButton) {
        masterButton.addEventListener("click", openMasterModal);
    }

    updateCurrentCards([cardImages[6], cardImages[7],]);
});

let isMasterRunning = false;

function openMasterModal() {
    let modal = document.createElement("div");
    modal.id = "master-modal";

    let alivePlayers = players.map((alive, i) => alive ? i : -1).filter(i => i !== -1);

    modal.innerHTML = `
        <div class="modal-content">
            <div id="player-selection">
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
    if (isMasterRunning) return;

    isMasterRunning = true;
    disablePlayerButtons();

    let shooterIndex = parseInt(document.getElementById("shooter").value);
    let targetIndex = parseInt(document.getElementById("target").value);

    if (shooterIndex === targetIndex || !players[targetIndex] || !players[shooterIndex] || attempts[shooterIndex] >= 6) {
        alert("Escolha um alvo válido! O atirador e o alvo devem ser diferentes e estar vivos.");
        isMasterRunning = false;
        enablePlayerButtons();
        return;
    }

    let targetButton = document.getElementById(`p${targetIndex + 1}`);
    let shooterIcon = document.getElementById(`i${shooterIndex + 1}`);
    let targetIcon = document.getElementById(`i${targetIndex + 1}`);
    let gunShot = document.getElementById("gunShot");
    let surviveSound = document.getElementById("surviveSound");

    attempts[shooterIndex]++;
    shooterIcon.src = `images/vida${attempts[shooterIndex]}.png`;

    console.log(`🔫 ${playerNames[shooterIndex]} atirou! Municões restantes: ${6 - attempts[shooterIndex]}`);
    console.log(`🎯 Imagem do atirador atualizada para: images/vida${attempts[shooterIndex]}.png`);

    let morte = attempts[shooterIndex] >= 6 || Math.random() < 1 / 6;

    if (morte) {
        gunShot.play();
        players[targetIndex] = false;
        targetIcon.src = "images/morto.gif";
        targetButton.classList.add("dead");
        console.log(`💀 ${playerNames[targetIndex]} foi eliminado!`);

        attempts[shooterIndex] = 0;
        shooterIcon.src = `images/vida0.png`;
        console.log(`🔄 ${playerNames[shooterIndex]} recarregou! Munições resetadas.`);

        function normalizeName(name) {
            return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        setTimeout(() => {
            let ouch = new Audio("./audios/ouch.mp3");
            ouch.play();
        }, 500);
    } else {
        surviveSound.play();
    }

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

            players.forEach((alive, i) => {
                if (alive) {
                    scores[i]++;
                }
            });
            saveScores();
            resetGame();
        }, 3000);
    }

    closeMasterModal();

    isMasterRunning = false;
    enablePlayerButtons();
}

function playMaster(shooterIndex, targetIndex) {
    if (!players[shooterIndex] || !players[targetIndex] || attempts[shooterIndex] >= 6 || shooterIndex === targetIndex) return;

    let targetButton = document.getElementById(`p${targetIndex + 1}`);
    let shooterIcon = document.getElementById(`i${shooterIndex + 1}`);
    let targetIcon = document.getElementById(`i${targetIndex + 1}`);
    let gunShot = document.getElementById("gunShot");
    let surviveSound = document.getElementById("surviveSound");

    attempts[shooterIndex]++;
    shooterIcon.src = `images/vida${attempts[shooterIndex]}.png`;

    let morte = attempts[shooterIndex] >= 6 || Math.random() < 1 / 6;

    if (morte) {
        gunShot.play();
        players[targetIndex] = false;
        targetIcon.src = "images/morto.gif";
        targetButton.classList.add("dead");

        attempts[shooterIndex] = 0;
        shooterIcon.src = `images/vida0.png`;

        setTimeout(() => {
            let ouch = new Audio("./audios/ouch.mp3");
            ouch.play();
        }, 500);
    } else {
        surviveSound.play();
    }

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

            players.forEach((alive, i) => {
                if (alive) {
                    scores[i]++;
                }
            });
            saveScores();
            resetGame();
        }, 3000);
    }
}
