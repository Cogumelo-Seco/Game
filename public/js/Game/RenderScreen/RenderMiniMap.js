module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    const miniMap = document.getElementById('miniMap')
    const ctx = miniMap.getContext('2d')

    //if (game.state.fps.split('-')[0] <= 30) return

    let miniMapSize = 100

    miniMap.width = miniMapSize
    miniMap.height = miniMapSize

    ctx.fillStyle = cookie.darkTheme == 'true' ? '#363636' : '#CCC';
    ctx.fillRect(0, 0, miniMap.width, miniMap.height)    

    for (let fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]

        let x = Math.floor(miniMapSize/game.state.screen.width*fruit.x)
        let y = Math.floor(miniMapSize/game.state.screen.height*fruit.y)

        ctx.globalAlpha = cookie.animations == 'true' ? Math.random()*0.5+0.3 : 0.6
        ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black'
        ctx.fillRect(x, y, 1, 1)
    }

    for (let playerId in game.state.players) {
        const player = game.state.players[playerId]
        if (!player.dead) {
            let playerSize = Math.floor(miniMap.height/30)

            let x = Math.floor(miniMapSize/game.state.screen.width*player.x-(playerSize/2))
            let y = Math.floor(miniMapSize/game.state.screen.height*player.y-(playerSize/2))

            ctx.globalAlpha = 0.5
            ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
            ctx.fillRect(x, y, playerSize, playerSize);
            ctx.fillStyle = 'red'
            if (playerId == game.state.myID) ctx.fillStyle = 'orange'
            ctx.fillRect(x, y, playerSize, playerSize);
        }
    }
}