window.onload = function () {
    document.getElementById('loading-spinner').style.display = 'none';
};

document.addEventListener("DOMContentLoaded", () => {
    let audioElements = document.querySelectorAll("audio");
    let loadedCount = 0;

    function checkAllLoaded() {
        loadedCount++;
        if (loadedCount === audioElements.length) {
            document.body.classList.remove("loading"); // Remove a restrição de interação
            document.getElementById("loading-spinner").style.display = "none"; // Esconde o spinner
        }
    }

    audioElements.forEach(audio => {
        audio.addEventListener("canplaythrough", checkAllLoaded, { once: true });
    });

    // Se algum áudio falhar ao carregar, ainda permitir o jogo após um tempo
    setTimeout(() => {
        if (loadedCount < audioElements.length) {
            document.body.classList.remove("loading");
            document.getElementById("loading-spinner").style.display = "none";
        }
    }, 5000); // Tempo máximo de espera
});
