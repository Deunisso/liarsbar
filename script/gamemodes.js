document.addEventListener("DOMContentLoaded", () => {
    let gamemodesAudio = document.getElementById('gameModesAudio');
    
    gamemodesAudio.play();

    document.querySelectorAll('.button').forEach(btn => {
        btn.classList.remove('disabled');
    });
});

function playAudio(button) {
    let audio;
    const buttons = document.querySelectorAll('.button');

    buttons.forEach(btn => {
        if (btn.id !== button) {
            btn.classList.add('disabled');
        }
    });

    if (button === 'basic') {
        audio = document.getElementById('audio-basic');
        audio.play();
        setTimeout(() => {
            window.location.href = 'game.html?mode=basic';
        }, audio.duration * 1000);

    } else if (button === 'devil') {
        audio = document.getElementById('audio-devil');
        audio.play();
        setTimeout(() => {
            window.location.href = 'game.html?mode=devil';
        }, audio.duration * 1000);
    } else if (button === 'chaos') {
        
        audio = document.getElementById('audio-chaos');
        audio.play();
        setTimeout(() => {
            window.location.href = 'game.html?mode=chaos';
        }, audio.duration * 1000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.button').forEach(btn => {
        btn.classList.remove('disabled');
    });
});