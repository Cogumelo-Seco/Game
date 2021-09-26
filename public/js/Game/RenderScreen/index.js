export default function renderScreen(canvas, game, requestAnimationFrame, Listener) {
    canvas.width = window.innerWidth/Listener.state.zoom;
    canvas.height = window.innerHeight/Listener.state.zoom;

    let fps = Number(game.state.fps.split('-')[0])
    game.state.fps = `${fps + 1}-${game.state.fps.split('-')[1]}`

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    game.subscribe((command) => {
        if (command.type != 'remove-player') return;
        for (let i = 0; i < command.traces.length; i++) {
            let trace = command.traces[i]
            ctx.clearRect(trace.x, trace.y, 1, 1);
        }
    })

    let scoreArr = []
    for (let i in game.state.players)
        scoreArr.push({ score: game.state.players[i].score, nick: game.state.players[i].nick, playerId: i })
    scoreArr = scoreArr.slice().sort((a, b) => b.score-a.score)

    const myPlayer = game.state.players[game.state.myID]

    if (game.state.players[game.state.observedPlayerId] && game.state.players[game.state.observedPlayerId].dead) {
        let players = []
        for (let i in game.state.players) {
            if (game.state.players[i] && !game.state.players[i].dead) players.push(i)
        }
        game.state.observedNumber++
        if (game.state.observedNumber > players.length-1) game.state.observedNumber = 0
        game.state.observedPlayerId = players[game.state.observedNumber]
    }
    if (myPlayer && myPlayer.dead && !game.state.players[game.state.observedPlayerId]) game.state.observedPlayerId = Object.keys(game.state.players)[0]

    if (myPlayer && myPlayer.dead && game.state.players[game.state.observedPlayerId] || myPlayer) {        
        require('./RenderBackgroundAndBoundaries')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderPlayers')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderFruits')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderChat')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderScoreTable')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderMiniMap')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderInformationTexts')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderPlayerSelectionToLook')(canvas, game, requestAnimationFrame, Listener, scoreArr)
    }

    let rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

    rAF(() => {
        renderScreen(canvas, game, requestAnimationFrame, Listener)
    })
}