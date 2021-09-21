module.exports = (command, state, notifyAll, removeFruit) => {
    if (!command.keyPressed) return;
    notifyAll(command)

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
        let up1 = false;
        if (player.x == fruit.x && player.y == fruit.y) {
            player.score++
            if (player.score%50 == 0) up1 = true;
            removeFruit({ 
                up1,
                playerId: command.playerId,
                fruitId 
            })
        }
    }
}