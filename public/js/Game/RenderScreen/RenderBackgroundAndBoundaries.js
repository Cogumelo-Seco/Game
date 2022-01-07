module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]
    const ctx = canvas.getContext('2d')

    ctx.globalAlpha = 0.02

    let backgroundImage = new Image()
    backgroundImage.src = `/images/background-${cookie.darkTheme == 'true' ? 'white' : 'black'}.png`

    for (let x = (Number.parseInt(canvas.width/2))-player.x; x < canvas.width+canvas.width; x += 1000) {
        for (let y = (Number.parseInt(canvas.height/2))-player.y; y < canvas.width+canvas.height; y += 1000) {
            ctx.drawImage(backgroundImage, x, y, 1000, 1000)
        }
    }

    ctx.fillStyle = cookie.darkTheme == 'true' ? 'rgb(170, 50, 50)' : '#f03434';
    ctx.globalAlpha = 1
    ctx.fillRect(0, (Number.parseInt(canvas.height/2))-player.y, canvas.width*2, -canvas.height*2);
    ctx.fillRect(0, (Number.parseInt(canvas.height/2)+game.state.screen.height)-player.y, canvas.width*2, canvas.height*2);
    ctx.fillRect((Number.parseInt(canvas.width/2))-player.x, 0, -canvas.width*2, canvas.height*2);
    ctx.fillRect((Number.parseInt(canvas.width/2)+game.state.screen.width)-player.x, 0, canvas.width*2, canvas.height*2);
}