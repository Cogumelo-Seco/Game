module.exports = (command, state, notifyAll, removeFruit) => {
    if (!command || !command.keyPressed) return;
	command.verify = state.myID
    command.serverId = state.serverId
    if (command.serverId != state.serverId) {
        if (!command.verify) notifyAll(command)
        return;
    }

    const acceptedKeys = require('./acceptedKeys')

    let bot = state.players[command.botId];
    if (!bot || !bot.bot) return;

    const keyPressed = command.keyPressed
    const moveFunction = acceptedKeys[keyPressed]

    if (moveFunction && !command.x && !command.y) {
        let move = moveFunction(bot, state)
        if (move) bot.traces.unshift({ x: bot.x, y: bot.y })
        command.x = bot.x
        command.y = bot.y
        command.traces = bot.traces
    } else if (command.x && command.y) {
        bot.x = command.x
        bot.y = command.y
        bot.traces = command.traces
    }
    notifyAll(command)

    if (bot.traces.length-1 > bot.score || bot.traces.length >= 1000) bot.traces.splice(bot.traces.length-1, 1)
    
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