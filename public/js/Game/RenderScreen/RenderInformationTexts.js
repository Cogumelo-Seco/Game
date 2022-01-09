module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    //if (player.dead) player = game.state.players[game.state.observedPlayerId]

    const playerScore = document.getElementById('playerScore');
    const fpsDisplay = document.getElementById('fpsDisplay');
    const pingDisplay = document.getElementById('pingDisplay');
    const fruitCounter = document.getElementById('fruitCounter');
    const playerCounter = document.getElementById('playerCounter');
    const timer = document.getElementById('timer');
    const serverType = document.getElementById('serverType');

    if (!player.dead) {
        playerScore.innerText = `Score: ${player.score}`
        playerScore.style.backgroundColor = 'rgba(0, 0, 0, 0.658)'
    } else {
        playerScore.innerText = 'Morto'
        playerScore.style.backgroundColor = 'rgba(255, 0, 0, 0.658)'
    }
    
    serverType.innerText = game.state.serverType
    
    if (Number(game.state.time)) {
        if (game.state.stopped && !game.state.gameOver) timer.innerText = 'Esperando o administrador começar a partida'
        else if (game.state.stopped && game.state.gameOver) timer.innerText = 'Jogo acabado'
        else {
            let time = game.state.time
            time = time/1000
            let seconds = ("00" +  Math.floor(time % 60)).slice(-2)
            let minutes = ("00" +  Math.floor(time / 60) % 60).slice(-2)
            if (minutes == '00') timer.innerText = `${seconds}s`
            else timer.innerText = `${minutes}:${seconds}`
            if (time <= 0) timer.innerText = `0s`
        }
    }

    if (cookie.showInfos == 'true') {
        if (+new Date()-game.state.fps.split('-')[1] > 1000) {
            let FPS = game.state.fps.split('-')[0]
            if (FPS >= 25 && FPS <= 45) fpsDisplay.style.color = 'rgb(255, 150, 50)'
            else if (FPS <= 25) fpsDisplay.style.color = 'rgb(255, 50, 50)'
            else fpsDisplay.style.color = 'rgb(100, 200, 100)'
            fpsDisplay.innerText = `${FPS}FPS`
            game.state.fps = `0-${+new Date()}`
        }

        if (game.state.ping >= 220 && game.state.ping <= 300) pingDisplay.style.color = 'rgb(255, 150, 50)'
        else if (game.state.ping >= 300) pingDisplay.style.color = 'rgb(255, 50, 50)'
        else pingDisplay.style.color = 'rgb(100, 200, 100)'
        pingDisplay.innerText = `${game.state.ping}ms`

        let playerCount = 0
        for (let i in game.state.players) playerCount++
        playerCounter.innerText = `${playerCount}Players`

        let fruitCount = 0
        for (let i in game.state.fruits) fruitCount++
        fruitCounter.innerText = `${fruitCount}Frutas`
    }
}