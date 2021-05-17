export default function renderScreen(canvas, game, scoreTable, pingDisplay, requestAnimationFrame) {
    const ctx = canvas.getContext('2d')
    const scoreTable1 = document.getElementById('scoreTable1');
    const scoreTable2 = document.getElementById('scoreTable2');
    const scoreTable3 = document.getElementById('scoreTable3');

    game.subscribe((command) => {
        if (command.type != 'remove-player') return;
        for (let i = 0; i < command.traces.length; i++) {
            let trace = command.traces[i]
            ctx.clearRect(trace.x, trace.y, 1, 1);
        }
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];

        let arr = []
        for (let i in game.state.players){
            arr.push({ score: game.state.players[i].score, nick: game.state.players[i].nick })
        }
        arr = arr.slice().sort((a, b) => b.score-a.score)

        scoreTable.innerText = ''
        scoreTable1.innerText = ''
        scoreTable2.innerText = ''
        scoreTable3.innerText = ''
        if (arr[0]) scoreTable1.innerText = `1° ${arr[0].nick}: ${arr[0].score}`
        if (arr[1]) scoreTable2.innerText = `2° ${arr[1].nick}: ${arr[1].score}`
        if (arr[2]) scoreTable3.innerText = `3° ${arr[2].nick}: ${arr[2].score}`
        for (let i = 3; i < arr.length; i++) {
            scoreTable.innerText += `${i+1}° ${arr[i].nick}: ${arr[i].score}\n`;
        }

        pingDisplay.innerText = `${game.state.ping}ms`

        for (let i = 0; i < player.traces.length; i++) {
            if (game.state.myID == playerId) ctx.fillStyle = 'green';
            else ctx.fillStyle = '#363636';
            let trace = player.traces[i]
            ctx.globalAlpha = 0.7
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
        renderScreen(canvas, game, scoreTable, pingDisplay, requestAnimationFrame)
    })
}