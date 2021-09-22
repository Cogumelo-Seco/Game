module.exports = (command, state, notifyAll) => {
    const player = state.players[command.playerId]

    if (!player) return;

    console.log('Propriedades corretas aplicada')
    notifyAll(command)

    if (player.x != command.x || player.y != command.y) {
        player.x = command.x,
        player.y = command.y,
        player.traces = command.traces
        player.score = command.score
    }
}