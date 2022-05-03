module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]
    const ctx = canvas.getContext('2d')
    const tileSize = cookie.performanceMode == 'false' ? game.state.tileSize : 1

    for (const playerId in game.state.players) {
        const player2 = game.state.players[playerId];
        if (!player2.bot && !player2.dead) renderPlayer(player2, playerId)
        else if (player2.bot) renderPlayer(player2, playerId)
    }

    function renderPlayer(player2, playerId) {
        let color1 = player2.color || '#00bd1f'
        let color2 = playerId == scoreArr[0].playerId ? 'gold': game.state.myID == playerId ? '#00bd1f' : cookie.darkTheme == 'true' ? 'white' : 'black'

        if (player2.safeTime || game.state.stopped) {
            color1 = 'red';
            color2 = 'red';
        }

        for (let i = 0; i < player2.traces.length; i++) {            
            let trace = player2.traces[i]
            let x = (trace.x*tileSize)-(player.x*tileSize)+(Number.parseInt(canvas.width/2))
            let y = (trace.y*tileSize)-(player.y*tileSize)+(Number.parseInt(canvas.height/2))
            if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
                ctx.globalAlpha = 0.2

                ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
                
                if (trace.fruit && cookie.performanceMode == 'false') {
                    ctx.beginPath();
                    ctx.arc(x+(tileSize/2), y+(tileSize/2), tileSize/4, 0, 2 * Math.PI)
                    ctx.fill();
                } if (trace.fruit) ctx.globalAlpha = 0.4

                ctx.fillRect(x, y, tileSize, tileSize);
                ctx.fillStyle = color1;
                ctx.fillRect(x, y, tileSize, tileSize);
            }
        }

        let x = (player2.x*tileSize)-(player.x*tileSize)+(Number.parseInt(canvas.width/2))
        let y = (player2.y*tileSize)-(player.y*tileSize)+(Number.parseInt(canvas.height/2))
        if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
            ctx.globalAlpha = 0.5
            ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';

            ctx.fillRect(x, y, tileSize, tileSize);
            ctx.fillStyle = color1;
            if (color2) ctx.fillStyle = color2;
            ctx.fillRect(x, y, tileSize, tileSize);

            if (cookie.performanceMode == 'false') {
                ctx.globalAlpha = 1
                ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';

                if (player2.playerImage) {
                    let playerImage = game.state.images[player2.playerImage]
                    if (!playerImage) {
                        playerImage = new Image()
                        playerImage.src = player2.playerImage
                        game.state.images[player2.playerImage] = playerImage
                    }
                    ctx.drawImage(playerImage, x, y, tileSize, tileSize)
                }

                ctx.font = `bold ${tileSize}px`
                ctx.fillText(player2.nick, x+(tileSize/2)-(ctx.measureText(player2.nick).width/2), y-(tileSize/4));
            }
        }
    }
}