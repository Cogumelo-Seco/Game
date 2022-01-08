module.exports = (command, state, notifyAll) => {
    let playerId = command.playerId
    if (!state.players[playerId]) return;

    notifyAll({
        type: 'remove-player',
        playerId: playerId,
        traces: state.players[playerId].traces,
		serverId: state.serverId
    })

    delete state.players[playerId]

    if (!state.players[playerId]) return true
}