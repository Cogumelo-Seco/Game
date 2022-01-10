function createGame(cookie) {
    const state = {
        fps: '0-0',
        ping: '?',
        noConnection: 0,
        time: NaN,
		serverTime: 120000,
        observedNumber: 0,
        observedPlayerId: null,
        messages: [],
        players: {},
        fruits: {},
		stopped: true,
        gameOver: false,
        playersSize: 10,        
        screen: {
            width: 50,
            height: 50
        }        
    }

    const observers = []

    const getGameFunction = (type) => require(`./GameFunctions/${type}`)

    const subscribe = (observerFunction) => observers.push(observerFunction)

    const notifyAll = (command) => {
        for (const observerFunction of observers) observerFunction(command)
    }

    const addPlayer = (command) => getGameFunction('addPlayer')(command, state, notifyAll)
    const removePlayer = (command) => getGameFunction('removePlayer')(command, state, notifyAll)
    const removeFruit = (command) => getGameFunction('removeFruit')(command, state, notifyAll)
    const changePlayer = (command) => getGameFunction('changePlayer')(command, state, notifyAll)
    const movePlayer = (command) => getGameFunction('movePlayer')(command, state, notifyAll, removeFruit)
    const playSoundEffect = (command) => getGameFunction('playSoundEffect')(command, state, notifyAll, cookie)
    state.playSoundEffect = playSoundEffect

    const setState = (newState) => Object.assign(state, newState)

    const ping = (command) => {
        if (command.ping && command.playerId == state.myID) {
            state.noConnection = 0
            state.ping = +new Date()-command.ping
        }
    }

    const message = (command) => {
        if (command.serverId != state.serverId) return
        if (state.messages.length >= 9) state.messages.splice(0, 1)
        if (!command.nick) command.nick = state.players[command.playerId] ? state.players[command.playerId].nick : ''
        if (command.content.trim()) state.messages.push(command)
    }

	const start = (game, socket, ServerFunctions, servers) => {
		let intervals = []
		intervals[0] = setInterval(() => {
			ServerFunctions.addFruit(game.state)
        }, game.state.fruitBirthSpeed || 1000)

		game.state.stopped = false
		game.state.time = game.state.serverTime
		intervals[1] = setInterval(() => {
			game.state.time -= 100
			if (game.state.time <= 0) {
				game.state.time = game.state.serverTime
				if (game.state.serverType == 'InfiniteServer') {
					for (let playerId in game.state.players) {
						game.changePlayer({
							playerId,
							score: 1,
							traces: [],
							serverId: game.state.serverId
						})
					}
				} else game.endOfTheGame({ serverId: game.state.serverId })
			}

            notifyAll({
                type: 'update-state',
                players: game.state.players,
                fruits: game.state.fruits,
                messages: game.state.messages,
				time: game.state.time,
                serverId: game.state.serverId,
            })
		}, 100)
		
		for (let botNumber = 0;botNumber < game.state.botCount; botNumber++) {
			ServerFunctions.serverAddBot({ servers, game, socket, botNumber })
		}

        if (!servers[game.state.serverId]) for (let i in intervals) clearInterval(intervals[i])

		notifyAll({
            type: 'startGame',
			serverId: state.serverId
        })
	}

    const endOfTheGame = (command, router) => {
        if (command.serverId != state.serverId) return;
        state.stopped = true;
        state.gameOver = true;

        if (state.myID) {
            let scoreArr = []
            for (let i in state.players) {
                if (!state.players[i].dead) scoreArr.push({ score: state.players[i].score, nick: state.players[i].nick, playerId: i })
            }
            scoreArr = scoreArr.sort((a, b) => b.score-a.score)

            const finalScreen = document.getElementById('finalScreen')
            const finalScreenP1 = document.getElementById('finalScreenP1')
            const finalScreenP2 = document.getElementById('finalScreenP2')
            const finalScreenP3 = document.getElementById('finalScreenP3')

            finalScreen.style.display = 'block'

            if (scoreArr[0]) finalScreenP1.innerText = `1º ${scoreArr[0].nick} - ${scoreArr[0].score}`
            if (scoreArr[1]) finalScreenP2.innerText = `2º ${scoreArr[1].nick} - ${scoreArr[1].score}`
            if (scoreArr[2]) finalScreenP3.innerText = `3º ${scoreArr[2].nick} - ${scoreArr[2].score}`

            setTimeout(() => router.push('/servers'), 30000)
        }

        notifyAll({
            type: 'endOfTheGame',
			serverId: state.serverId
        })
    }

    state.gameAlert = (text) => {
        const gameAlert = document.getElementById('gameAlert')        
        gameAlert.innerText = text
        gameAlert.style.display = 'flex'
        setTimeout(() => gameAlert.style.display = 'none', 5000)
    }

    function updateState(command) {
        for (let i in command) {
            if (i == 'players') {
                if (state.players[state.myID]) {
                    state.players[state.myID].score = command.players[state.myID].score
                    command.players[state.myID] = state.players[state.myID]
                }
                state.players = command.players
            } else if (i == 'messages') {
                if (state.messages[state.messages.length-1] != command.messages[command.messages.length-1]) state.messages.push(command.messages[command.messages.length-1])
                if (state.messages.length >= 9) state.messages.splice(0, 1)
            } else if (i != 'type') state[i] = command[i]
        }
    }
    
    return {
		notifyAll,
        movePlayer,
        addPlayer,
        removePlayer,
        removeFruit,
        state,
        setState,
        subscribe,
        start,
        changePlayer,
        endOfTheGame,
        ping,
        message,
        updateState,
        playSoundEffect
    }
}

module.exports = createGame