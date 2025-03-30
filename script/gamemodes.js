function playAudio(button) {
    let audio;
    const buttons = document.querySelectorAll('.button'); // Todos os botões com a classe 'button'

    // Desabilita todos os botões, exceto o clicado
    buttons.forEach(btn => {
        if (btn.id !== button) {
            btn.classList.add('disabled'); // Adiciona a classe 'disabled' aos botões não clicados
        }
    });

    if (button === 'basic') {
        audio = document.getElementById('audio-basic');
        audio.play();
        setTimeout(() => {
            window.location.href = 'game.html';
        }, audio.duration * 1000); 
    } else if (button === 'devil') {
        audio = document.getElementById('audio-devil');
        audio.play();
        setTimeout(() => {
            window.location.href = 'game2.html';
        }, audio.duration * 1000);
    } else if (button === 'chaos') {
        audio = document.getElementById('audio-chaos');
        audio.play();
        setTimeout(() => {
            window.location.href = 'game3.html';
        }, audio.duration * 1000);
    }
}
