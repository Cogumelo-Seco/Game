module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]
    const ctx = canvas.getContext('2d')

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];                
        let x = fruit.x-player.x+(Number.parseInt(canvas.width/2))
        let y = fruit.y-player.y+(Number.parseInt(canvas.height/2))
        if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
            ctx.globalAlpha = cookie.animations == 'true' ? Math.random()*0.2+0.4 : 0.5
            ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
            ctx.fillRect(x, y, 1, 1);
            ctx.fillStyle = fruit.color || 'red';
            ctx.fillRect(x, y, 1, 1);
        }
    }
}