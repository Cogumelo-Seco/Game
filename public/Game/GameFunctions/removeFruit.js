module.exports = (command, state, notifyAll) => {
    let fruitId = command.fruitId
    let playerId = command.playerId

    notifyAll({
        type: 'remove-fruit',
        fruitId,
        playerId
    })
    
    delete state.fruits[fruitId]
}