module.exports = (command, state, notifyAll) => {
    const botX = command.x || Math.floor(Math.random()*state.screen.height);
    const botY = command.y || Math.floor(Math.random()*state.screen.width);
    const botId = command.botId
    let nick = command['nick']
	if (state.players[botId]) return;

    state.players[botId] = {
        bot: true,
        x: botX,
        y: botY,
        nick: nick,
        direction: 'w',
        traces: [ { x: botX, y: botY } ],
        score: 1
    }

    notifyAll({
        type: 'add-bot',
        botId: botId,
        nick: nick,
        x: botX,
        y: botY,
		serverId: state.serverId
    });

    return state.players[botId]
}