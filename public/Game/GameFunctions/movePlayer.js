module.exports = (command, state, notifyAll, removeFruit) => {
    if (!command.keyPressed) return;
    notifyAll(command)

    //if (!command.auto) state.time = (+new Date())+120000

    const acceptedKeys = require('./acceptedKeys')

    let player = state.players[command.playerId];
    const keyPressed = command.keyPressed
        .replace('ArrowUp', 'w')
        .replace('ArrowDown', 's')
        .replace('ArrowLeft', 'a')
        .replace('ArrowRight', 'd')
    const moveFunction = acceptedKeys[keyPressed]
    
    if (!player || command.auto && command.keyPressed != player.direction) return;

    if (moveFunction) moveFunction(player, state)

    if (player.traces.length > player.score) player.traces.splice(0, 1)

    for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]
        if (player.x == fruit.x && player.y == fruit.y) {
            player.score++

            if (command.playerId == state.myID) {
                if (player.score%50 == 0) var song = new Audio('/songs/up+.mp3');
                else var song = new Audio('/songs/up.mp3');
                song.play()
            }

            removeFruit({ 
                playerId: command.playerId,
                fruitId 
            })
        }
    }
}