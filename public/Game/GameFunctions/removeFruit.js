module.exports = (command, state, notifyAll) => {
    let fruitId = command.fruitId
    let playerId = command.playerId
    if (command.up1) var song = 'up100'
    else var song = 'up'

    notifyAll({
        type: 'remove-fruit',
        fruitId,
        playerId
    })
    notifyAll({
        type: 'song',
        playerId,
        song
    })
    
    delete state.fruits[fruitId]
}