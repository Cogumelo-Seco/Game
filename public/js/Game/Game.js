function createGame() {
    const state = {
        fps: '0-0',
        ping: '?',
        time: NaN,
		serverTime: 120000,
        observedNumber: 0,
        observedPlayerId: null,
        messages: [],
        players: {},
        fruits: {},
		paused: true,
        screen: {
            width: 50,
            height: 50
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
    const deadPlayer = (command) => getGameFunction('deadPlayer')(command, state, notifyAll)
    const movePlayer = (command) => getGameFunction('movePlayer')(command, state, notifyAll, removeFruit)
    const moveBot = (command) => getGameFunction('moveBot')(command, state, notifyAll, removeFruit)

    const setState = (newState) => Object.assign(state, newState)

    const ping = (command) => {
        notifyAll(command)
        if (command.ping && command.playerId == state.myID) state.ping = +new Date()-command.ping
    }

    const message = (command) => {
        if (command.serverId != state.serverId) return
        command.read = false
        notifyAll(command)
        let messages = []
        for (let i in state.messages) {
            let message = state.messages[i]
            let filter = messages.filter((m) => m.nick == message.nick && m.content == message.content)
            if (!filter[0]) messages.push(message)
        }
        state.messages = messages
        if (state.messages.length >= 9) state.messages.splice(0 ,1)
        if (!command.nick) command.nick = state.players[command.playerId] ? state.players[command.playerId].nick : ''
        if (command.content.trim()) state.messages.push(command)
    }

	const start = (game, sockets, serverAddBot) => {
		setInterval(() => addFruit({ serverId: game.state.serverId }), 1000)

		game.state.paused = false
		game.state.time = game.state.serverTime
		setInterval(() => {
			game.state.time -= 1000
			if (game.state.time <= 0) {
				game.state.time = game.state.serverTime
				game.resetGame()
			}
		}, 1000)
		
		for (let botNumber = 0;botNumber < game.state.botCount; botNumber++) {
			serverAddBot(game, sockets, botNumber, 0)
		}

		notifyAll({
            type: 'startGame'
        })
	}

    const clientStart = () => {
        state.paused = false
    }

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
        deadPlayer,
        clientStart
    }
}

module.exports = createGame