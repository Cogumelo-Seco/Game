module.exports = (command, state, notifyAll) => {
    const player = state.players[command.playerId]
    const score = command.score || player.score
    const traces = command.traces || player.traces
    if (!player) return
    player.score = score

    if (command.tracesAdditional) player.traces = player.traces.concat(traces)
    else player.traces = traces

    notifyAll({
        type: 'change-player',
        playerId: command.playerId,
        score,
        traces,
        tracesAdditional: command.tracesAdditional || false,
		serverId: state.serverId
    })
}