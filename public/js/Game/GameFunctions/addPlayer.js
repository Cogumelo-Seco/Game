module.exports = (command, state, notifyAll) => {
	if (command.serverId != state.serverId) return
    const playerId = command.playerId
    let nick = command['nick']

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
        nick: nick,
        bot: false,
        dead: false,
        direction: 'w',
        traces: [ { x: playerX, y: playerY } ],
        score: 1
    }

    notifyAll({
        type: 'add-player',
        playerId: playerId,
        nick: nick,
        x: playerX,
        y: playerY,
		serverId: state.serverId
    });
}