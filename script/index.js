let selectedPlayers = [];

function selectPlayer(element, player) {
    const selectSound = new Audio(`./audios/select_${player}.ogg`);
    const deselectSound = new Audio(`./audios/deselect.mp3`);

    selectSound.load();

    const convertedPlayer = convertName(player);
    const imgElement = element.querySelector("img");

    if (selectedPlayers.includes(convertedPlayer)) {
        deselectSound.play();
        selectedPlayers = selectedPlayers.filter(p => p !== convertedPlayer);
        element.classList.remove("selected");
        imgElement.src = `./images/${player.toLowerCase()}.png`; 
        
    } else if (selectedPlayers.length < 4) {
        selectSound.play();
        selectedPlayers.push(convertedPlayer);
        element.classList.add("selected");
        imgElement.src = `./images/${player.toLowerCase()}_selected.png`;
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
    let clickAudio = new Audio("./audios/click.mp3");
    clickAudio.currentTime = 0;  
    clickAudio.play();

    clickAudio.onended = function () {
        localStorage.removeItem("scores");  
        let resetScores = [0, 0, 0, 0]; 
        localStorage.setItem("scores", JSON.stringify(resetScores)); 
        localStorage.setItem("players", JSON.stringify(selectedPlayers));

        window.location.href = 'gamemodes.html';
    };
}