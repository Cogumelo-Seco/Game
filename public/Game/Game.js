function createGame() {
    const state = {
        ping: '?',
        time: 0,
        messages: [],
        players: {},
        fruits: {},
        screen: {
            width: 200,
            height: 200
        }
    }

    const observers = []

    const getGameFunction = (type) => require(`./GameFunctions/${type}`)

    const subscribe = (observerFunction) => observers.push(observerFunction)

    const notifyAll = (command) => {
        if (observers.length > 10) observers.splice(0)
        for (const observerFunction of observers) {
			observerFunction(command)
        }
    }

    const addPlayer = (command) => getGameFunction('addPlayer')(command, state, notifyAll)
    const addBot = (command) => getGameFunction('addBot')(command, state, notifyAll)
    const addFruit = (command) => getGameFunction('addFruit')(command, state, notifyAll)
    const removePlayer = (command) => getGameFunction('removePlayer')(command, state, notifyAll)
    const removeFruit = (command) => getGameFunction('removeFruit')(command, state, notifyAll)
    const changePlayer = (command) => getGameFunction('changePlayer')(command, state, notifyAll)
    const movePlayer = (command) => getGameFunction('movePlayer')(command, state, notifyAll, removeFruit)
    const moveBot = (command) => getGameFunction('moveBot')(command, state, notifyAll, removeFruit)
	const botArtificialIntelligence = (command) => getGameFunction('botArtificialIntelligence')(command, state, notifyAll, removeFruit)

    const setState = (newState) => Object.assign(state, newState)

    const ping = (command) => {
        notifyAll(command)
        if (command.ping && command.playerId == state.myID) state.ping = +new Date()-command.ping
    }

    const message = (command) => {
        notifyAll(command)
        if (state.messages.length >= 8) state.messages.splice(0 ,1)
        if (!command.nick) command.nick = state.players[command.playerId] ? state.players[command.playerId].nick : ''
        if (command.content.trim()) state.messages.push(command)
    }

	const start = (interval) => setInterval(addFruit, interval || 2000)

    const resetGame = () => {
        state.fruits = {}

        notifyAll({
            type: 'reset-game',
        })
    }

    return {
		notifyAll,
        movePlayer,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        state,
        setState,
        subscribe,
        start,
        changePlayer,
        resetGame,
        ping,
        message,
        addBot,
        moveBot,
		botArtificialIntelligence
    }
}

module.exports = createGame