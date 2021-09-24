module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]

    const fpsDisplay = document.getElementById('fpsDisplay');
    if (+new Date()-game.state.fps.split('-')[1] > 1000) {
        fpsDisplay.innerText = `${game.state.fps.split('-')[0]}FPS`
        game.state.fps = `0-${+new Date()}`
    }

    const pingDisplay = document.getElementById('pingDisplay');
    pingDisplay.innerText = `${game.state.ping}ms`

    const playerScore = document.getElementById('playerScore');
    if (!player.dead) playerScore.innerText = `Score: ${player.score}`

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