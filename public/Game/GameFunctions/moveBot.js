module.exports = (command, state, notifyAll, removeFruit) => {
    if (!command.keyPressed) return;
    notifyAll(command)

    const acceptedKeys = require('./acceptedKeys')

    let bot = state.players[command.botId];
    const keyPressed = command.keyPressed
    const moveFunction = acceptedKeys[keyPressed]

    if (!bot || !bot.bot) return;

    if (moveFunction) moveFunction(bot, state)

    if (bot.traces.length > bot.score) bot.traces.splice(0, 1)
    
    for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]
        let up1 = false;
        if (bot.x == fruit.x && bot.y == fruit.y) {
            bot.score++
            if (bot.score%50 == 0) up1 = true;
            removeFruit({ 
                up1,
                playerId: command.playerId,
                fruitId 
            })
        }
    }
}