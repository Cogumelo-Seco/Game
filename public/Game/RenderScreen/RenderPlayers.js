module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const myPlayer = game.state.players[game.state.myID]
    const ctx = canvas.getContext('2d')

    function renderPlayer(x, y, trace, color, color2) {
        ctx.fillStyle = color;
        if (trace) {
            ctx.globalAlpha = 0.5
            let x = (trace.x-myPlayer.x)+(Number.parseInt(canvas.width/2))
            let y = (trace.y-myPlayer.y)+(Number.parseInt(canvas.height/2))
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1
        if (color2) ctx.fillStyle = color2;
        ctx.fillRect(x, y, 1, 1);
    }

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];        

        for (let i = 0; i < player.traces.length; i++) {
            let trace = player.traces[i]
            let x = (trace.x-myPlayer.x)+(Number.parseInt(canvas.width/2))
            let y = (trace.y-myPlayer.y)+(Number.parseInt(canvas.height/2))
            if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) renderPlayer((player.x-myPlayer.x)+(Number.parseInt(canvas.width/2)), (player.y-myPlayer.y)+(Number.parseInt(canvas.height/2)), trace, game.state.myID == playerId ? 'green' : '#363636', playerId == scoreArr[0].playerId ? 'rgb(204, 146, 0)': false);
        }
    }
}