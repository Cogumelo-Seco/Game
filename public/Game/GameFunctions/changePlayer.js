module.exports = (command, state, notifyAll) => {
    const player = state.players[command.playerId]
    const score = command.score || player.score
    const traces = command.traces || player.traces
    player.score = score

    notifyAll({
        type: 'change-player',
        playerId: command.playerId,
        score,
        traces
    })
}