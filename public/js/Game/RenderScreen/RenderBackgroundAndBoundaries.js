module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]
    const ctx = canvas.getContext('2d')
    const tileSize = cookie.performanceMode == 'false' ? game.state.tileSize : 1

    ctx.globalAlpha = 0.007
    
    /*let backgroundImage = game.state.images['backgroundImage'] 
    if (!backgroundImage) {
        backgroundImage = new Image()
        backgroundImage.src = `/images/background-${cookie.darkTheme == 'true' ? 'white' : 'black'}.png`
        game.state.images['backgroundImage'] = backgroundImage
    }

    for (let x = (Number.parseInt(canvas.width/2-tileSize/2))-(player.x*tileSize); x < canvas.width+canvas.width; x += 1000) {
        for (let y = (Number.parseInt(canvas.height/2-tileSize/2))-(player.y*tileSize); y < canvas.width+canvas.height; y += 1000) {
            ctx.drawImage(backgroundImage, x, y, 1000, 1000)
        }
    }*/

    ctx.fillStyle = cookie.darkTheme == 'true' ? 'rgb(170, 50, 50)' : '#f03434';
    ctx.globalAlpha = 1
    ctx.fillRect(0, (Number.parseInt(canvas.height/2-tileSize/2))-(player.y*tileSize), canvas.width*2, -canvas.height*2);
    ctx.fillRect(0, (Number.parseInt(canvas.height/2-tileSize/2)+(game.state.screen.height*tileSize))-(player.y*tileSize), canvas.width*2, canvas.height*2);
    ctx.fillRect((Number.parseInt(canvas.width/2-tileSize/2))-(player.x*tileSize), 0, -canvas.width*2, canvas.height*2);
    ctx.fillRect((Number.parseInt(canvas.width/2-tileSize/2)+(game.state.screen.width*tileSize))-(player.x*tileSize), 0, canvas.width*2, canvas.height*2);
}