let selectedPlayers = [];

function selectPlayer(element, player) {
    const selectSound = new Audio('./audios/select.mp3');
    const playerSound = new Audio(`./audios/${player}.mp3`);
    const deselectSound = new Audio(`./audios/deselect.mp3`);

    // Pré-carregar os áudios
    selectSound.load();
    playerSound.load();

    // Converte o nome antes de adicionar
    const convertedPlayer = convertName(player);

    if (selectedPlayers.includes(convertedPlayer)) {
        // Toca o áudio de deseleção
        deselectSound.play();

        selectedPlayers = selectedPlayers.filter(p => p !== convertedPlayer);
        element.classList.remove("selected");
    } else if (selectedPlayers.length < 4) {
        // Toca o áudio de seleção
        selectSound.play();

        // Play player's specific sound immediately after select.mp3
        selectSound.onended = function () {
            playerSound.play();
        };

        selectedPlayers.push(convertedPlayer);
        element.classList.add("selected");
    }

    let startButton = document.getElementById("start-game");
    if (selectedPlayers.length === 4) {
        startButton.classList.add("enabled");
        startButton.disabled = false;
    } else {
        startButton.classList.remove("enabled");
        startButton.disabled = true;
    }
}

function convertName(name) {
    const nameMapping = {
        'Kaua': 'Kauã',
        'Leticia': 'Letícia',
        // Adicione outros nomes que precisem de conversão
    };
    return nameMapping[name] || name; // Retorna o nome convertido ou o nome original se não houver mapeamento
}

function startGame() {
    localStorage.setItem("players", JSON.stringify(selectedPlayers));
    window.location.href = "game.html";  // Substitua pelo nome correto da página do jogo
}
