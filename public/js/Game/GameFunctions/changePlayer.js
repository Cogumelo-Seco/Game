module.exports = (command, state, notifyAll) => {
    if (command.serverId != state.serverId) return
    const player = state.players[command.playerId]
    const score = command.score || player.score
    const traces = command.traces || player.traces
    player.score = score
    player.traces = traces

    notifyAll({
        type: 'change-player',
        playerId: command.playerId,
        score,
        traces,
		serverId: state.serverId
    })
}