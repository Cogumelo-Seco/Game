export default function renderScreen(canvas, game, requestAnimationFrame, Listener, cookie) {
    canvas.width = window.innerWidth/Listener.state.zoom;
    canvas.height = window.innerHeight/Listener.state.zoom;

    let fps = Number(game.state.fps.split('-')[0])
    game.state.fps = `${fps + 1}-${game.state.fps.split('-')[1]}`

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = cookie.darkTheme == 'true' ? '#363636' : '#CCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let scoreArr = []
    for (let i in game.state.players) {
        if (!game.state.players[i].dead) scoreArr.push({ score: game.state.players[i].score, nick: game.state.players[i].nick, playerId: i })
    }
    scoreArr = scoreArr.sort((a, b) => b.score-a.score)

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
        require('./RenderBackgroundAndBoundaries')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderPlayers')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderFruits')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderChat')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderScoreTable')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderInformationTexts')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderPlayerSelectionToLook')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderMiniMap')(canvas, game, Listener, scoreArr, cookie)
        require('./RenderADMOptions')(canvas, game, Listener, scoreArr, cookie)
    }

    let rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

    if (!game.state.router) rAF(() => {
        renderScreen(canvas, game, requestAnimationFrame, Listener, cookie)
    })
}