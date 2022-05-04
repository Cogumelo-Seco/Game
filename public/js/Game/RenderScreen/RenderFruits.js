module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]
    const ctx = canvas.getContext('2d')
    const tileSize = cookie.performanceMode == 'false' ? game.state.tileSize : 1

    for (const fruitId in game.state.fruits) {
        let fruit = game.state.fruits[fruitId];
        let x = (fruit.x*tileSize)-(player.x*tileSize)+(Number.parseInt(canvas.width/2-tileSize/2))
        let y = (fruit.y*tileSize)-(player.y*tileSize)+(Number.parseInt(canvas.height/2-tileSize/2))
        if (x >= -tileSize && y >= -tileSize && x < canvas.width && y < canvas.height) {
            ctx.globalAlpha = cookie.animations == 'true' ? Math.random()*0.6+0.15 : 0.5
            ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';

            if (cookie.performanceMode == 'false') {
                ctx.beginPath();
                ctx.arc(x+(tileSize/2), y+(tileSize/2), tileSize/4, 0, 2 * Math.PI)
                ctx.fill();
                ctx.fillStyle = fruit.color || 'red';
                ctx.fill();
            } else {
                ctx.fillRect(x, y, tileSize, tileSize);
                ctx.fillStyle = fruit.color || 'red';
                ctx.fillRect(x, y, tileSize, tileSize);
            }
        }
    }
}