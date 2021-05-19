export default function renderScreen(canvas, game, pingDisplay, requestAnimationFrame) {
    const ctx = canvas.getContext('2d')
    const scoreTable1 = document.getElementById('p1');
    const scoreTable2 = document.getElementById('p2');
    const scoreTable3 = document.getElementById('p3');
    const scoreTable4 = document.getElementById('p4');
    const chat = document.getElementById('chat-content')

    const timer = document.getElementById('timer')
    let seconds = ("00" +  Math.floor(game.state.time % 60)).slice(-2)
    let minutes = ("00" +  Math.floor(game.state.time / 60) % 60).slice(-2)
    timer.innerText = `${minutes}:${seconds}`

    chat.innerText = ''
    for (let i = 0; i < game.state.messages.length; i++) {
        chat.innerText += `⠀${game.state.messages[i].nick}: ${game.state.messages[i].content}\n`
    }

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

        let arr = []
        for (let i in game.state.players){
            arr.push({ score: game.state.players[i].score, nick: game.state.players[i].nick, playerId: i })
        }
        arr = arr.slice().sort((a, b) => b.score-a.score)

        scoreTable4.innerText = ''
        scoreTable1.innerText = ''
        scoreTable2.innerText = ''
        scoreTable3.innerText = ''
        if (arr[0]) {
            scoreTable1.innerText = `1º ${arr[0].nick}: ${arr[0].score}`
            player = game.state.players[arr[0].playerId]
            for (let i = 0; i < player.traces.length; i+=2) {
                ctx.fillStyle = '#ffa600';
                let trace = player.traces[i]
                ctx.globalAlpha = 0.7
                ctx.clearRect(trace.x, trace.y, 1, 1);
                ctx.fillRect(trace.x, trace.y, 1, 1);
                if (game.state.myID == arr[0].playerId) ctx.fillStyle = 'green';
                else ctx.fillStyle = '#363636';
                ctx.globalAlpha = 1
                ctx.fillRect(player.x, player.y, 1, 1);
            }
        }
        if (arr[1]) scoreTable2.innerText = `2º ${arr[1].nick}: ${arr[1].score}`
        if (arr[2]) scoreTable3.innerText = `3º ${arr[2].nick}: ${arr[2].score}`
        for (let i = 3; i < arr.length; i++) {
            scoreTable4.innerText += `${i+1}º ${arr[i].nick}: ${arr[i].score}\n`;
        }
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        ctx.fillStyle = 'red';
        ctx.globalAlpha = 0.5
        ctx.fillRect(fruit.x, fruit.y, 1, 1);
    }

    requestAnimationFrame(() => {
        renderScreen(canvas, game, pingDisplay, requestAnimationFrame)
    })
}