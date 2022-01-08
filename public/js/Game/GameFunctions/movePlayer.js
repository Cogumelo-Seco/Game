module.exports = (command, state, notifyAll, removeFruit) => {    
    if (!command.keyPressed) return;
    const acceptedKeys = require('./acceptedKeys')

    let player = state.players[command.playerId];
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

	if (!command.server) {
        let move = moveFunction(player, state)
        if (move) player.traces.unshift({ x: player.x, y: player.y })
	} else {
		player.x = command.player.x
		player.y = command.player.y
		player.traces = command.player.traces
		player.direction = command.player.direction
	}

    player.traces.splice(player.score+1, player.traces.length)
	player.traces.splice(300, player.traces.length)

    for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]
        if (player.x == fruit.x && player.y == fruit.y) {
            if (!state.stopped) {
                player.traces[0].fruit = true
                player.score += 1
            }

            if (command.playerId == state.myID) {
                if (player.score%50 == 0) state.playSoundEffect('up+')
                else state.playSoundEffect('up')
            }

            removeFruit({ 
                playerId: command.playerId,
                fruitId,
				serverId: state.serverId 
            })
        }
    }
}