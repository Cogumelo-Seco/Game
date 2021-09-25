module.exports = (command, state, notifyAll) => {
	if (command.serverId != state.serverId) return
    const fruitX = command ? command.x || Math.floor(Math.random()*state.screen.height) : Math.floor(Math.random()*state.screen.height);
    const fruitY = command ? command.y || Math.floor(Math.random()*state.screen.height) : Math.floor(Math.random()*state.screen.width);
    const fruitId = Math.random().toString(36).substring(2)
    if (state.fruits[fruitId]) return

    state.fruits[fruitId] = {
        x: fruitX,
        y: fruitY
    }

    notifyAll({
        type: 'add-fruit',
        fruitId: fruitId,
        x: fruitX,
        y: fruitY,
		serverId: state.serverId
    });
}