module.exports = (command, state, notifyAll) => {
    const fruitX = command ? command.x || Math.floor(Math.random()*state.screen.height) : Math.floor(Math.random()*state.screen.height);
    const fruitY = command ? command.y || Math.floor(Math.random()*state.screen.height) : Math.floor(Math.random()*state.screen.width);
    const fruitId = command.fruitId || Math.random().toString(36).substring(2)+'-'+state.serverId
    const fruitColor = command.color || '#'+Math.floor(Math.random()*16777215).toString(16);

    let fruitCount = 0
    for (let i in state.fruits) fruitCount++

    if (state.fruits[fruitId] || fruitCount >= state.screen.width*4) return

    state.fruits[fruitId] = {
        x: fruitX,
        y: fruitY,
        color: fruitColor
    }

    notifyAll({
        type: 'add-fruit',
        fruitId: fruitId,
        x: fruitX,
        y: fruitY,
        color: fruitColor,
		serverId: state.serverId
    });
}