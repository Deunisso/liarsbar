let selectedPlayers = [];

function selectPlayer(element, player) {
    const selectSound = new Audio('./audios/select.mp3');
    const playerSound = new Audio(`./audios/${player}.mp3`);
    const deselectSound = new Audio(`./audios/deselect.mp3`);

    selectSound.load();
    playerSound.load();

    const convertedPlayer = convertName(player);

    if (selectedPlayers.includes(convertedPlayer)) {
        deselectSound.play();

        selectedPlayers = selectedPlayers.filter(p => p !== convertedPlayer);
        element.classList.remove("selected");
    } else if (selectedPlayers.length < 4) {
        selectSound.play();

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
    };
    return nameMapping[name] || name; 
}

function startGame() {
    localStorage.setItem("players", JSON.stringify(selectedPlayers));
 
    const page = 'gamemodes.html';
    window.location.href = page;
}
