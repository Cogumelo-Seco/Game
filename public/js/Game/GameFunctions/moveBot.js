module.exports = (command, state, notifyAll, removeFruit) => {
    if (!command || !command.keyPressed) return;
	command.verify = state.myID
    command.serverId = state.serverId
    if (!command.verify) notifyAll(command)
	if (command.serverId != state.serverId) return

    const acceptedKeys = require('./acceptedKeys')

    let bot = state.players[command.botId];
    if (!bot || !bot.bot) return;
    
    bot.x = command.x || bot.x
    bot.y = command.y || bot.y
    const keyPressed = command.keyPressed
    const moveFunction = acceptedKeys[keyPressed]

    if (moveFunction) moveFunction(bot, state)

    if (bot.traces.length > bot.score || bot.traces.length >= 1500) bot.traces.splice(0, 1)
    
    for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]
        if (bot.x == fruit.x && bot.y == fruit.y) {
            bot.score++
            removeFruit({ 
                playerId: command.playerId,
                fruitId,
				serverId: state.serverId 
            })
        }
    }
}