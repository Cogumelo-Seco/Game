function createGame(cookie) {
    const state = {
        fps: '0-0',
        averageFPS: [],
        ping: '?',
        averagePing: [],
        noConnection: 0,
        time: NaN,
		serverTime: 120000,
        observedNumber: 0,
        observedPlayerId: null,
        unreadMessages: 0,
        messages: {},
        players: {},
        fruits: {},
        images: [],
		stopped: true,
        gameOver: false,
        tileSize: 50,
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

    const changePlayer = (command) => getGameFunction('changePlayer')(command, state, notifyAll)
    const movePlayer = (command) => getGameFunction('movePlayer')(command, state, notifyAll)
    const playSoundEffect = (command) => getGameFunction('playSoundEffect')(command, state, notifyAll, cookie)
    state.playSoundEffect = playSoundEffect

    const setState = (newState) => Object.assign(state, newState)

    const ping = (command) => {
        if (command.ping && command.playerId == state.myID) {
            state.noConnection = 0
            state.ping = +new Date()-command.ping

            state.averagePing.unshift(state.ping)
            state.averagePing.splice(20, state.averagePing.length)
        }
    }

    const serverMessage = (message) => {
		message.messageId = Math.random().toString(36).substring(2)+'-'+state.serverId
        if (!message.nick) message.nick = state.players[message.playerId] ? state.players[message.playerId].nick : ''
        if (message.content.trim()) state.messages[message.messageId] = message
    }

    const message = (message) => {
        const chatContent = document.getElementById('chat-content')
        const chatButton = document.getElementById('chat-button')
        const unreadMessageCounter = document.getElementById('unreadMessageCounter')
        const chat = document.getElementById('chat')        

        let scoreArr = []
        for (let i in state.players) {
            if (!state.players[i].dead) scoreArr.push({ score: state.players[i].score, nick: state.players[i].nick, playerId: i })
        }
        scoreArr = scoreArr.sort((a, b) => b.score-a.score)

        if (!message.read && chat.style.display == 'block') message.read = true;
        if (!message.read && state.unreadMessages < 99) state.unreadMessages += 1

        if (scoreArr[0] && scoreArr[0].nick == message.nick) message.color = 'rgb(255, 196, 48)'
        if (message.playerId && state.players[message.playerId] && state.players[message.playerId].dead) {
            message.emoji = '👻'
            message.color = 'gray'
            message.color2 = 'red'
            message.nameAdditionalCSS = 'text-decoration: line-through'
        }
        if (!message.system && !state.players[message.playerId]) {
            message.emoji = '🚫'
            message.color = 'gray'
            message.color2 = 'rgb(200, 200, 200)'
            message.nameAdditionalCSS = 'text-decoration: line-through'
        }
        if (scoreArr[0] && scoreArr[0].nick == message.nick) message.emoji = '👑'

        chatContent.innerHTML += `
            <p id="Name" style="color: ${message.color || 'rgb(0, 229, 255)'} ${message.nameAdditionalCSS ? ';'+message.nameAdditionalCSS : ''}">${message.nick} ${message.emoji || ''}</p>
            <p id="Message" style="color: ${message.color2 || 'white'} ${message.messageAdditionalCSS ? ';'+message.messageAdditionalCSS : ''}">${message.content}</p>
        `
        chatContent.scrollTop = chatContent.scrollHeight

        if (state.unreadMessages > 0) {
            unreadMessageCounter.style.display = 'flex'
            unreadMessageCounter.innerText = state.unreadMessages
            chatButton.style.background = 'rgba(0, 0, 0, 0.658) url(/images/unreadChat.png) no-repeat center 0px / 100%'
        } else {
            unreadMessageCounter.style.display = 'none'
            chatButton.style.background = 'rgba(0, 0, 0, 0.658) url(/images/chat.png) no-repeat center 0px / 100%'
        }
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
                    state.players[state.myID].safeTime = command.players[state.myID].safeTime
                    state.players[state.myID].color = command.players[state.myID].color
                    command.players[state.myID] = state.players[state.myID]
                }
                state.players = command.players
            } else if (i == 'messages') {
                for (let messageId in command.messages) {
                    if (!state.messages[messageId]) {
                        state.messages[messageId] = command.messages[messageId]
                        message(command.messages[messageId])
                    }
                }
            } else if (i != 'type') state[i] = command[i]
        }
    }
    
    return {
		notifyAll,
        movePlayer,
        state,
        setState,
        subscribe,
        changePlayer,
        endOfTheGame,
        ping,
        message,
        serverMessage,
        updateState,
        playSoundEffect
    }
}

module.exports = createGame