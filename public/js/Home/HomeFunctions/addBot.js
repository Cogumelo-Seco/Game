module.exports = (command, state, botArtificialIntelligence) => {
    const botId = Math.random().toString(36).substring(2)
    if (state.bots[botId]) return
    let X = Math.floor(Math.random()*state.screen.width-2)+1
    let Y = Math.floor(Math.random()*state.screen.height-2)+1

    let bot = state.bots[botId] = {
        x: X == 0 ? 1 : X,
        y: Y == 0 ? 1 : Y,
        color: '#'+Math.floor(Math.random()*16777215).toString(16),
        direction: 's',
        score: 1,
        traces: []
    }

    botArtificialIntelligence({ bot }, state)
}