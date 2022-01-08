module.exports = (command, state, notifyAll) => {
    let fruitId = command.fruitId
    let playerId = command.playerId

    if (!state.fruits[fruitId] || !state.players[playerId]) return

    delete state.fruits[fruitId]

    notifyAll({
        type: 'remove-fruit',
        fruitId,
        playerId,
		serverId: state.serverId
    })    
}