module.exports = (command, state, notifyAll) => {
    if (command.serverId != state.serverId) return
    const playerX = command.x || Math.floor(Math.random()*state.screen.height);
    const playerY = command.y || Math.floor(Math.random()*state.screen.width);
    const botId = command.botId
    let nick = command['nick']

    state.players[botId] = {
        bot: true,
        x: playerX,
        y: playerY,
        nick: nick,
        direction: 'w',
        traces: [ { x: playerX, y: playerY } ],
        score: 1
    }

    notifyAll({
        type: 'add-bot',
        botId: botId,
        nick: nick,
        x: playerX,
        y: playerY,
		serverId: state.serverId
    });

    return state.players[botId]
}