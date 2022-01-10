module.exports = (command, state, notifyAll) => {
    const player = state.players[command.playerId]
    const score = command.score || player.score
    const traces = command.traces || player.traces
    if (!player) return
    player.score = score
    player.dead = command.dead || false
    player.safeTime = command.safeTime || false

    if (command.tracesAdditional) player.traces = player.traces.concat(traces)
    else player.traces = traces

    notifyAll({
        type: 'change-player',
        playerId: command.playerId,
        score,
        traces,
        safeTime: command.safeTime || false,
        dead: command.dead || false,
        tracesAdditional: command.tracesAdditional || false,
		serverId: state.serverId
    })
}