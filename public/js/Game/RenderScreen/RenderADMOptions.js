module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    const startButton = document.getElementById('startButton')

    if (game.state.stopped && game.state.myID == game.state.adm && !game.state.gameOver) {
        startButton.style.display = 'block'
    } else {
        startButton.style.display = 'none'
    }
}