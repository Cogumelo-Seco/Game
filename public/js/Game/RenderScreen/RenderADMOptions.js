module.exports = (canvas, game, Listener, scoreArr) => {
    const startButton = document.getElementById('startButton')

    if (game.state.stopped && game.state.myID == game.state.adm) {
        startButton.style.display = 'block'
    }
}