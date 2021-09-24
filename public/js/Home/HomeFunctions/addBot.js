module.exports = (command, state, botArtificialIntelligence) => {
    const botId = Math.random().toString(36).substring(2)
    if (state.bots[botId]) return
    let X = Math.floor(Math.random()*state.screen.width-2)
    let Y = Math.floor(Math.random()*state.screen.height-2)

    let bot = state.bots[botId] = {
        x: X == 0 ? 1 : X,
        y: Y == 0 ? 1 : Y,
        direction: 's',
        score: 1,
        traces: []
    }

    botArtificialIntelligence({ bot }, state)
}