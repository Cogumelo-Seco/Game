module.exports = (command, state, notifyAll) => {        
    const acceptedKeys = require('./acceptedKeys')
    let player = state.players[command.playerId];

	if (!command.keyPressed || !player) return;

    let keyPressed = command.keyPressed

    switch(keyPressed) {
        case 'ArrowUp':
            if (player.y <= 0) return player.direction = 'a';
            else keyPressed = 'w'
            break
        case 'ArrowDown':
            if (player.y >= state.screen.width-1) return player.direction = 'd';
            else keyPressed = 's'
            break
        case 'ArrowLeft':
            if (player.x <= 0) return player.direction = 's';
            else keyPressed = 'a'
            break
        case 'ArrowRight':
            if (player.x >= state.screen.height-1) return player.direction = 'w';
            else keyPressed = 'd'
            break
    }

    const moveFunction = acceptedKeys[keyPressed]

    if (!player || command.auto && command.keyPressed != player.direction) return;
    if (player.dead) return;

    if (!command.x && !command.y) {
        let move = moveFunction(player, state)
        if (move) player.traces.unshift({ x: player.x, y: player.y })
        command.x = player.x
		command.y = player.y
		command.traces = player.traces
		command.direction = player.direction
    } else {
        player.x = command.x
		player.y = command.y
		player.traces = command.traces
		player.direction = command.direction
    }

    notifyAll(command)

    player.traces.splice(player.score+1, player.traces.length)
	player.traces.splice(300, player.traces.length)

    for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]
        if (fruit.x == player.x && fruit.y == player.y) {
            if (!state.stopped) {
                player.traces[0].fruit = true
                player.score += 1
            }

            if (command.playerId == state.myID) {
                if (player.score%50 == 0) state.playSoundEffect('up+')
                else state.playSoundEffect('up')
            }

            if (command.ServerFunctions) command.ServerFunctions.removeFruit({ 
                playerId: command.playerId,
                fruitId,
				serverId: state.serverId,
				state
            })
        }
    }
}