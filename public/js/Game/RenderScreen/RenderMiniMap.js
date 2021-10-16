module.exports = (canvas, game, Listener, scoreArr) => {
    const miniMap = document.getElementById('miniMap')
    const ctx = miniMap.getContext('2d')

    miniMap.width = game.state.screen.width
    miniMap.height = game.state.screen.height

    ctx.clearRect(0, 0, miniMap.width, miniMap.height)

    for (let playerId in game.state.players) {
        const player = game.state.players[playerId]
        if (!player.dead) {
            let playerSize = Math.floor(miniMap.height/30)
            if (playerSize < 1) playerSize = 1

            ctx.fillStyle = 'red'
            if (playerId == scoreArr[0].playerId) ctx.fillStyle = 'rgb(204, 146, 0)'
            if (game.state.myID == playerId) ctx.fillStyle = 'green'

            ctx.fillRect(player.x-Math.floor(playerSize/2), player.y-Math.floor(playerSize/2), playerSize, playerSize)
        }
    }
}