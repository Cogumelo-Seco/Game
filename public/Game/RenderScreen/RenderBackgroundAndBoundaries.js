module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const myPlayer = game.state.players[game.state.myID]
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'gray';
    ctx.globalAlpha = 0.05

    for (let x = (Number.parseInt(canvas.height/2))-myPlayer.x; x < canvas.width+canvas.height; x += 2) {
        for (let y = (Number.parseInt(canvas.height/2))-myPlayer.y; y < canvas.width+canvas.height; y += 2) {
            ctx.fillRect(x, y, 1, 1)
        }
    }
    for (let x = (Number.parseInt(canvas.height/2))-myPlayer.x; x < canvas.width+canvas.height; x += 3) {
        for (let y = (Number.parseInt(canvas.height/2))-myPlayer.y; y < canvas.width+canvas.height; y += 3) {
            ctx.fillRect(x, y, 1, 1)
        }
    }

    ctx.fillStyle = '#f03434';
    ctx.globalAlpha = 1
    ctx.fillRect(0, (Number.parseInt(canvas.height/2))-myPlayer.y, canvas.width*2, -canvas.height*2);
    ctx.fillRect(0, (Number.parseInt(canvas.height/2)+game.state.screen.height)-myPlayer.y, canvas.width*2, canvas.height*2);
    ctx.fillRect((Number.parseInt(canvas.width/2))-myPlayer.x, 0, -canvas.width*2, canvas.height*2);
    ctx.fillRect((Number.parseInt(canvas.width/2)+game.state.screen.width)-myPlayer.x, 0, canvas.width*2, canvas.height*2);
}