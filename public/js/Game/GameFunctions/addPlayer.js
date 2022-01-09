module.exports = (command, state, notifyAll) => {
    const playerId = command.playerId

    let playerX = command.x
    let playerY = command.y

    function generatePlayerPosition() {
        let X = Math.floor(Math.random()*state.screen.height);
        let Y = Math.floor(Math.random()*state.screen.width);
		playerX = X
		playerY = Y
        
        for (let i in state.players) {
            let player = state.players[i]
			let traces = player.traces
			if (traces.find((t) => t.x == X && t.y == Y)) generatePlayerPosition()
        }
    }

    if (!playerX || !playerY) generatePlayerPosition()

    state.players[playerId] = {
        x: playerX,
        y: playerY,
        nick: command.nick,
		color: command.color,
        bot: false,
        dead: false,
        direction: 'w',
        traces: [ { x: playerX, y: playerY } ],
        score: 1,
        safeTime: true
    }

    notifyAll({
        type: 'add-player',
        playerId,
        nick: command.nick,
		color: command.color,
        x: playerX,
        y: playerY,
		serverId: state.serverId
    });

    setTimeout(() => {
        let player = state.players[playerId]
        if (player) player.safeTime = false
    }, Math.floor(Math.random()*3000)+3000)
}