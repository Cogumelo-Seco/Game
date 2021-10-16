module.exports = (command, state, notifyAll) => {
//alert(command.fruitId)
	//if (command.serverId != state.serverId) return
    let fruitId = command.fruitId
    let playerId = command.playerId

    notifyAll({
        type: 'remove-fruit',
        fruitId,
        playerId,
		serverId: state.serverId
    })
    
    delete state.fruits[fruitId]
}