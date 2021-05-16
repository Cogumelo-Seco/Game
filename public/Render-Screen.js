export default function renderScreen(canvas, game, scoreTable, requestAnimationFrame, myPlayerId) {
    const ctx = canvas.getContext('2d')

    game.subscribe((command) => {
        if (command.type != 'remove-player') return;
        for (let i = 0; i < command.traces.length; i++) {
            let trace = command.traces[i]
            ctx.clearRect(trace.x, trace.y, 1, 1);
        }
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    scoreTable.innerText = ''
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        scoreTable.innerText += `${player.nick}: ${player.score*13}\n`;

        if (myPlayerId == playerId) {
            ctx.fillStyle = 'green';
            ctx.fillRect(player.x, player.y, 1, 1);
        } else {
            ctx.fillStyle = '#363636';
            ctx.fillRect(player.x, player.y, 1, 1);
        }

        for (let i = 0; i < player.traces.length; i++) {
            let trace = player.traces[i]
            ctx.globalAlpha = 0.8
            ctx.clearRect(trace.x, trace.y, 1, 1);
            ctx.fillRect(trace.x, trace.y, 1, 1);
            ctx.globalAlpha = 1
            ctx.fillRect(player.x, player.y, 1, 1);
        }
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        ctx.fillStyle = 'red';
        ctx.globalAlpha = 0.5
        ctx.fillRect(fruit.x, fruit.y, 1, 1);
    }

    requestAnimationFrame(() => {
        renderScreen(canvas, game, scoreTable, requestAnimationFrame, myPlayerId)
    })
}