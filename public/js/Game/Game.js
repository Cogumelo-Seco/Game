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
    const playSoundEffect = (command) => getGameFunction('playSoundEffect')(command, state, notifyAll, cookie)
    state.playSoundEffect = playSoundEffect

    const setState = (newState) => Object.assign(state, newState)

    const ping = (command) => {
        notifyAll(command)
        if (command.ping && command.playerId == state.myID) {
            state.noConnection = 0
            state.ping = +new Date()-command.ping
        }
    }

    const message = (command) => {
        if (command.serverId != state.serverId) return
        notifyAll(command)
        if (state.messages.length >= 9) state.messages.splice(0 ,1)
        if (!command.nick) command.nick = state.players[command.playerId] ? state.players[command.playerId].nick : ''
        if (command.content.trim()) state.messages.push(command)
    }

	const start = (game, sockets, socket, serverAddBot) => {
		setInterval(() => addFruit({ serverId: game.state.serverId }), game.state.fruitBirthSpeed || 1000)

		game.state.stopped = false
		game.state.time = game.state.serverTime
		setInterval(() => {
			game.state.time -= 1000
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
		}, 1000)
		
		for (let botNumber = 0;botNumber < game.state.botCount; botNumber++) {
			serverAddBot(game, sockets, socket, botNumber, 0)
		}

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
        endOfTheGame,
        ping,
        message,
        addBot,
        moveBot,
        deadPlayer,
        playSoundEffect
    }
}

module.exports = createGame