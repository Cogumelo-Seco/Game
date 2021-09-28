module.exports = (command, state, notifyAll, removeFruit) => {
    if (!command.keyPressed) return;
    command.verify = state.myID
	command.serverId = state.serverId    
    if (command.serverId != state.serverId) {
        if (!command.verify) notifyAll(command)
        return;
    }
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

    if (moveFunction && !command.x && !command.y) {
        let move = moveFunction(player, state)
        if (move) player.traces.unshift({ x: player.x, y: player.y })
        command.x = player.x
        command.y = player.y
        command.traces = player.traces
    } else if (command.x && command.y) {
        player.x = command.x
        player.y = command.y
        player.traces = command.traces
    }
    notifyAll(command)

    if (player.traces.length-1 > player.score || player.traces.length >= 1000) player.traces.splice(player.traces.length-1, 1)

    for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]
        if (player.x == fruit.x && player.y == fruit.y) {
            player.score++

            if (command.playerId == state.myID) {
                let song = new Audio('/songs/up.mp3');
                if (player.score%50 == 0) song = new Audio('/songs/up+.mp3');
                song.play()
            }

            removeFruit({ 
                playerId: command.playerId,
                fruitId,
				serverId: state.serverId 
            })
        }
    }
}