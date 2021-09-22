module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const myPlayer = game.state.players[game.state.myID]

    const pingDisplay = document.getElementById('pingDisplay');
    pingDisplay.innerText = `${game.state.ping}ms`

    const playerScore = document.getElementById('playerScore');
    if (!game.dead) playerScore.innerText = `Score: ${myPlayer.score}`

    if (game.state.time) {
        const timer = document.getElementById('timer')
        let time = game.state.time-(+new Date())
        if (time <= 0) game.state.time = (+new Date())+game.state.serverTime
        time = time/1000
        let seconds = ("00" +  Math.floor(time % 60)).slice(-2)
        let minutes = ("00" +  Math.floor(time / 60) % 60).slice(-2)
        if (minutes == '00') timer.innerText = `${seconds}s`
        else timer.innerText = `${minutes}:${seconds}`
    }
}