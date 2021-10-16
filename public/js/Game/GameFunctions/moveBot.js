module.exports = (command, state, notifyAll, removeFruit) => {
	command.verify = state.myID
    command.serverId = state.serverId
    if (command.serverId != state.serverId) {
        if (!command.verify) notifyAll(command)
        return;
    }

    let bot = state.players[command.botId];
    if (!bot || !bot.bot) return;

	bot.x = command.x
	bot.y = command.y
	bot.score = command.score
	bot.traces = command.traces
	
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