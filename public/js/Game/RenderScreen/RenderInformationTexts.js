module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    //if (player.dead) player = game.state.players[game.state.observedPlayerId]

    const playerScore = document.getElementById('playerScore');
    const fpsDisplay = document.getElementById('fpsDisplay');
    const pingDisplay = document.getElementById('pingDisplay');
    const fruitCounter = document.getElementById('fruitCounter');
    const playerCounter = document.getElementById('playerCounter');

    if (!player.dead) playerScore.innerText = `Score: ${player.score}`
    else {
        playerScore.innerText = 'Morto'
        playerScore.style.backgroundColor = 'rgba(255, 0, 0, 0.658)'
    }

    if (cookie.showInfos == 'true') {
        if (+new Date()-game.state.fps.split('-')[1] > 1000) {
            fpsDisplay.innerText = `${game.state.fps.split('-')[0]}FPS`
            game.state.fps = `0-${+new Date()}`
        }

        pingDisplay.innerText = `${game.state.ping}ms`

        let playerCount = 0
        for (let i in game.state.players) playerCount++
        playerCounter.innerText = `${playerCount}Players`

        let fruitCount = 0
        for (let i in game.state.fruits) fruitCount++
        fruitCounter.innerText = `${fruitCount}Frutas`
    }

    const timer = document.getElementById('timer')
    
    if (Number(game.state.time)) {
        if (game.state.stopped && !game.state.gameOver) timer.innerText = 'Esperando o administrador começar a partida'
        else if (game.state.stopped && game.state.gameOver) timer.innerText = 'Jogo acabado'
        else {
            let time = game.state.time-(+new Date())
            if (time <= 1) game.state.time = (+new Date())+game.state.serverTime
            time = time/1000
            let seconds = ("00" +  Math.floor(time % 60)).slice(-2)
            let minutes = ("00" +  Math.floor(time / 60) % 60).slice(-2)
            if (minutes == '00') timer.innerText = `${seconds}s`
            else timer.innerText = `${minutes}:${seconds}`
            if (time <= 0) timer.innerText = `0s`
        }
    }
}