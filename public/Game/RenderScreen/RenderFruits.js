module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const myPlayer = game.state.players[game.state.myID]
    const ctx = canvas.getContext('2d')

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        ctx.fillStyle = 'red';
        ctx.globalAlpha = 0.5
        let x = fruit.x-myPlayer.x+(Number.parseInt(canvas.width/2))
        let y = fruit.y-myPlayer.y+(Number.parseInt(canvas.height/2))
        if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) ctx.fillRect(x, y, 1, 1);
    }
}