document.addEventListener("load", function () {
    let devilButton = document.getElementById("devilButton");

    if (devilButton) {
        devilButton.addEventListener("click", openDevilModal);
    }
});

let isDevilRunning = false;

function openDevilModal() {
    let modal = document.createElement("div");
    modal.id = "devil-modal";

    let alivePlayers = players.map((alive, i) => alive ? i : -1).filter(i => i !== -1);

    modal.innerHTML = `
        <div class="modal-content">
            <div id="player-selection">
                ${alivePlayers.map(i => `
                    <div id="player-btn-${i}" class="player-button" onclick="togglePlayerSelection(${i})">${playerNames[i]}</div>
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

function closeDevilModal() {
    let modal = document.getElementById("devil-modal");
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

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

                function normalizeName(name) {
                    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                }

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
                return;
            }

        }, delay);
    }

    shuffledIndices.forEach((index, i) => {
        playSequential(index, i * 1500);
    });

    isPlaying = false;
}
