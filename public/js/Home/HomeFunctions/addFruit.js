module.exports = (command, state, botArtificialIntelligence) => {
    const fruitId = Math.random().toString(36).substring(2)
    if (state.fruits[fruitId]) return
    let X = Math.floor(Math.random()*state.screen.width-2)
    let Y = Math.floor(Math.random()*state.screen.height-2)

    state.fruits[fruitId] = {
        x: X == 0 ? 1 : X,
        y: Y == 0 ? 1 : Y,
    }
}