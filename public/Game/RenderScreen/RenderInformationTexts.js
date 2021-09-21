module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const myPlayer = game.state.players[game.state.myID]

    const pingDisplay = document.getElementById('pingDisplay');
    pingDisplay.innerText = `${game.state.ping}ms`

    const playerScore = document.getElementById('playerScore');
    playerScore.innerText = `Score: ${myPlayer.score}`

    const timer = document.getElementById('timer')
    let seconds = ("00" +  Math.floor(game.state.time % 60)).slice(-2)
    let minutes = ("00" +  Math.floor(game.state.time / 60) % 60).slice(-2)
    if (minutes == '00') timer.innerText = `${seconds}s`
    else timer.innerText = `${minutes}:${seconds}`
}