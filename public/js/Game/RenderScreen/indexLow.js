export default function renderLow(canvas, game, requestAnimationFrame, Listener) {
    let fps = Number(game.state.fps.split('-')[0])
    game.state.fps = `${fps + 1}-${game.state.fps.split('-')[1]}`

    let scoreArr = []
    for (let i in game.state.players)
        scoreArr.push({ score: game.state.players[i].score, nick: game.state.players[i].nick, playerId: i })
    scoreArr = scoreArr.slice().sort((a, b) => b.score-a.score)

    const myPlayer = game.state.players[game.state.myID]

    if (myPlayer && myPlayer.dead && game.state.players[game.state.observedPlayerId] || myPlayer) {        
        require('./RenderLowMiniMap')(canvas, game, requestAnimationFrame, Listener, scoreArr)
        require('./RenderLowInformationTexts')(canvas, game, requestAnimationFrame, Listener, scoreArr)
    }

    setTimeout(() => {
        renderLow(canvas, game, requestAnimationFrame, Listener)
    }, 1000)
}