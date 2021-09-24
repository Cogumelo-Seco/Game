module.exports = (command, state, notifyAll) => {
    const player = state.players[command.playerId]
    if (!player) return;
    player.dead = true

    notifyAll({
        type: 'deadPlayer',
        playerId: command.playerId,
    })
}