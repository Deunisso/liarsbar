let selectedPlayers = [];

function selectPlayer(element, player) {
    const selectSound = new Audio(`./audios/select_${player}.ogg`);
    const deselectSound = new Audio(`./audios/deselect.mp3`);

    selectSound.load();

    const convertedPlayer = convertName(player);

    if (selectedPlayers.includes(convertedPlayer)) {
        deselectSound.play();
        selectedPlayers = selectedPlayers.filter(p => p !== convertedPlayer);
        element.classList.remove("selected");
    } else if (selectedPlayers.length < 4) {
        selectSound.play();
        selectSound.onended = function () {
        };
        selectedPlayers.push(convertedPlayer);
        element.classList.add("selected");
    }

    let startButton = document.getElementById("start-game");
    startButton.disabled = selectedPlayers.length !== 4;
    startButton.classList.toggle("enabled", selectedPlayers.length === 4);
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
    window.location.href = 'gamemodes.html';
}
