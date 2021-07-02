export default function renderScreen(canvas, game, pingDisplay, requestAnimationFrame) {
    const ctx = canvas.getContext('2d')
    const scoreTable1 = document.getElementById('p1');
    const scoreTable2 = document.getElementById('p2');
    const scoreTable3 = document.getElementById('p3');
    const scoreTable4 = document.getElementById('p4');
    const chatCanvas = document.getElementById('chat-content')
    const chat = chatCanvas.getContext('2d')

    const timer = document.getElementById('timer')
    let seconds = ("00" +  Math.floor(game.state.time % 60)).slice(-2)
    let minutes = ("00" +  Math.floor(game.state.time / 60) % 60).slice(-2)
    if (minutes == '00') timer.innerText = `${seconds}s`
    else timer.innerText = `${minutes}:${seconds}`

    game.subscribe((command) => {
        if (command.type != 'remove-player') return;
        for (let i = 0; i < command.traces.length; i++) {
            let trace = command.traces[i]
            ctx.clearRect(trace.x, trace.y, 1, 1);
        }
    })

    const myPlayer = game.state.players[game.state.myID]
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];        

        pingDisplay.innerText = `${game.state.ping}ms`

        if (myPlayer) {
            ctx.fillStyle = 'gray';
            ctx.globalAlpha = 0.03
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

        function renderPlayer(x, y, trace, color, color2) {
            ctx.fillStyle = color;
            if (trace) {
                ctx.globalAlpha = 0.7
                ctx.clearRect((trace.x-myPlayer.x)+(Number.parseInt(canvas.width/2)), (trace.y-myPlayer.y)+(Number.parseInt(canvas.height/2)), 1, 1);
                ctx.fillRect((trace.x-myPlayer.x)+(Number.parseInt(canvas.width/2)), (trace.y-myPlayer.y)+(Number.parseInt(canvas.height/2)), 1, 1);
            }
            ctx.globalAlpha = 1
            ctx.fillRect(x, y, 1, 1);
        }

        for (let i = 0; i < player.traces.length; i++) {
            let trace = player.traces[i]
            if (game.state.myID == playerId) renderPlayer((Number.parseInt(canvas.width/2)), (Number.parseInt(canvas.height/2)), trace, 'green');
            else if (myPlayer) renderPlayer((player.x-myPlayer.x)+(Number.parseInt(canvas.width/2)), (player.y-myPlayer.y)+(Number.parseInt(canvas.height/2)), trace, '#363636');
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
            if (game.state.myID == arr[0].playerId) renderPlayer((Number.parseInt(canvas.width/2)), (Number.parseInt(canvas.height/2)), null, '#e19200');
            else if (myPlayer) renderPlayer((player.x-myPlayer.x)+(Number.parseInt(canvas.width/2)), (player.y-myPlayer.y)+(Number.parseInt(canvas.height/2)), null, '#e19200');
        }
        if (arr[1]) scoreTable2.innerText = `2º ${arr[1].nick}: ${arr[1].score}`
        if (arr[2]) scoreTable3.innerText = `3º ${arr[2].nick}: ${arr[2].score}`
        for (let i = 3; i < arr.length; i++) {
            scoreTable4.innerText += `${i+1}º ${arr[i].nick}: ${arr[i].score}\n`;
        }

        let y = -110
        chat.clearRect(0, 0, chatCanvas.width, chatCanvas.height)
        for (let i = 0; i < game.state.messages.length; i++) {
            chat.font = `bold 120px Arial Black`;
            chat.fillStyle = 'black'
            if (game.state.messages[i].system) chat.fillStyle = 'gray'

            y += 200
            let content = '';
            let count = 0;

            game.state.messages[i].content.split('').map(l => {
                if (count >= 20 && l == ' ') {
                    count = 0
                    content += `${l}\n`
                } else {
                    count++
                    content += l
                }
            });
            let lines = content.split('\n');
            for (let a = lines.length-1; a >= 0; a--) {
                chat.fillText(lines[a], 0, (chatCanvas.height-y))
                y += 140
            }
            chat.font = `bold 140px Arial Black`;
            chat.fillStyle = 'rgb(0, 147, 201)';
            if (arr[0] && arr[0].nick == game.state.messages[i].nick) chat.fillStyle = '#ffa600';
            if (arr[1] && arr[1].nick == game.state.messages[i].nick) chat.fillStyle = 'gray';
            if (arr[2] && arr[2].nick == game.state.messages[i].nick) chat.fillStyle = '#cd7f32';
            if (game.state.messages[i].system) chat.fillStyle = game.state.messages[i].color
            chat.fillText(`${game.state.messages[i].nick}: `, 0, chatCanvas.height-y)
        }
    }

    for (const fruitId in game.state.fruits) {
        if (myPlayer) {
            const fruit = game.state.fruits[fruitId];
            ctx.fillStyle = 'red';
            ctx.globalAlpha = 0.5
            ctx.fillRect(fruit.x-myPlayer.x+(Number.parseInt(canvas.width/2)), fruit.y-myPlayer.y+(Number.parseInt(canvas.height/2)), 1, 1);
        }
    }

    requestAnimationFrame(() => {
        renderScreen(canvas, game, pingDisplay, requestAnimationFrame)
    })
}