module.exports = (command, state, notifyAll, removeFruit) => {
    if (!command.keyPressed) return;
    notifyAll(command)

    const acceptedKeys = require('./acceptedKeys')

    let player = state.players[command.playerId];
    let keyPressed = command.keyPressed

    switch(keyPressed) {
        case 'ArrowUp':
            keyPressed = 'w'
            break
        case 'ArrowDown':
            keyPressed = 's'
            break
        case 'ArrowLeft':
            keyPressed = 'a'
            break
        case 'ArrowRight':
            keyPressed = 'd'
            break
    }

    const moveFunction = acceptedKeys[keyPressed]
    
    if (!player || command.auto && command.keyPressed != player.direction) return;

    if (moveFunction) moveFunction(player, state)

    if (player.traces.length > player.score) player.traces.splice(0, 1)

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
                fruitId 
            })
        }
    }
}