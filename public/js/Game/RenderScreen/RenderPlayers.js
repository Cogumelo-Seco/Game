module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]
    const ctx = canvas.getContext('2d')

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
            let x = (trace.x-player.x)+(Number.parseInt(canvas.width/2))
            let y = (trace.y-player.y)+(Number.parseInt(canvas.height/2))
            if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
                if (trace.fruit) ctx.globalAlpha = 0.4
                else ctx.globalAlpha = 0.2
                ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
                ctx.fillRect(x, y, 1, 1);
                ctx.fillStyle = color1;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        let x = (player2.x-player.x)+(Number.parseInt(canvas.width/2))
        let y = (player2.y-player.y)+(Number.parseInt(canvas.height/2))
        if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
            ctx.globalAlpha = 0.5
            ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
            ctx.fillRect(x, y, 1, 1);
            ctx.fillStyle = color1;
            if (color2) ctx.fillStyle = color2;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}