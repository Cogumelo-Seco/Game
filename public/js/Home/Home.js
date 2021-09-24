module.exports = (canvas) => {
    const state = {
        fruits: {},
        bots: {},
        screen: {
            width: 0,
            height: 0
        }
    }

    const getHomeFunction = (type) => require(`./HomeFunctions/${type}`)

    const background = (command) => getHomeFunction('background')(command, state)    
    const botArtificialIntelligence = (command) => getHomeFunction('botArtificialIntelligence')(command, state)
    const addBot = (command) => getHomeFunction('addBot')(command, state, botArtificialIntelligence)
    const addFruit = (command) => getHomeFunction('addFruit')(command, state, botArtificialIntelligence)

    return {
        state,
        background,
        botArtificialIntelligence,
        addBot,
        addFruit
    }
}