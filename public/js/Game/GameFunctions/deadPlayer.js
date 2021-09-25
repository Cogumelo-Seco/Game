module.exports = (command, state, notifyAll) => {
    if (command.serverId != state.serverId) return
    const player = state.players[command.playerId]
    if (!player) return;
    player.dead = true

    notifyAll({
        type: 'deadPlayer',
        playerId: command.playerId,
		serverId: state.serverId
    })
}