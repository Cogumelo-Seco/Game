export default function createGame() {
    const state = {
        ping: '?',
        time: 0,
        messages: [],
        players: {},
        fruits: {},
        screen: {
            width: 50,
            height: 50
        }
    }

    const observers = []

    function start(interval) {
        if (!interval) interval = 3000
        setInterval(addFruit, interval)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        if (observers.length > 10) observers.splice(0)
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function message(command) {
        notifyAll(command)
        if (state.messages.length > 31) state.messages.splice(0 ,1)
        command.nick = state.players[command.playerId].nick
        if (command.content.trim()) state.messages.push({ nick: command.nick, content: command.content })
    }

    function movePlayer(command) {
        notifyAll(command)
        if (command.ping && command.playerId == state.myID) state.ping = +new Date()-command.ping

        const acceptedMoves = {
            w(player) {
                if (player.traces.find((t) => t.x == player.x && t.y == player.y-1 && player.direction == 's')) return;
                if (player.y <= 0) player.y = state.screen.width-1
                else player.y--
                player.direction = 'w'
                player.traces.push({ x: player.x, y: player.y })
            },
            s(player) {
                if (player.traces.find((t) => t.x == player.x && t.y == player.y+1 && player.direction == 'w')) return;
                if (player.y >= state.screen.width-1) player.y = 0
                else player.y++
                player.direction = 's'
                player.traces.push({ x: player.x, y: player.y })
            },
            a(player) {
                if (player.traces.find((t) => t.x == player.x-1 && t.y == player.y && player.direction == 'd')) return;
                if (player.x <= 0) player.x = state.screen.height-1
                else player.x--
                player.direction = 'a'
                player.traces.push({ x: player.x, y: player.y })
            },
            d(player) {
                if (player.traces.find((t) => t.x == player.x+1 && t.y == player.y && player.direction == 'a')) return;
                if (player.x >= state.screen.height-1) player.x = 0
                else player.x++
                player.direction = 'd'
                player.traces.push({ x: player.x, y: player.y })
            }
        }

        let player = state.players[command.playerId];
        const keyPressed = command.keyPressed.replace('ArrowUp', 'w').replace('ArrowDown', 's').replace('ArrowLeft', 'a').replace('ArrowRight', 'd')
        const moveFunction = acceptedMoves[keyPressed]
        
        if (command.auto && command.keyPressed != player.direction || !player) return;

        if (moveFunction) moveFunction(player)

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            let up100 = false;
            if (fruit.x == player.x && fruit.y == player.y) {
                player.score++
                if (player.score%50 == 0) up100 = true;
                removeFruit({ 
                    up100,
                    fruitId 
                })
            }
        }
        if (player.traces.length > player.score) {
            player.traces.splice(0, 1)
        }
    }

    function changePlayer(command) {
        const player = state.players[command.playerId]
        player.score = command.score
        player.traces = command.traces || player.traces

        notifyAll({
            type: 'change-player',
            playerId: command.playerId,
            score: command.score,
            traces: command.traces
        })
    }

    function addFruit(command) {
        const fruitX = command ? command.x : Math.floor(Math.random()*state.screen.height)+1;
        const fruitY = command ? command.y : Math.floor(Math.random()*state.screen.width)+1;
        const fruitId = Math.random().toString(36).substring(2)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            x: fruitX,
            y: fruitY
        });
    }
    function removeFruit(command) {
        let fruitId = command.fruitId

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId,
        })

        if (command.up100) var song = 'up100'
        else var song = 'up'
        notifyAll({
            type: 'song',
            song
        })
        
        delete state.fruits[fruitId]
    }

    function addPlayer(command) {
        const playerX = command.x || Math.floor(Math.random()*state.screen.height)+1;
        const playerY = command.y || Math.floor(Math.random()*state.screen.width)+1;
        const playerId = command.playerId
        let nick = command['nick']

        state.players[playerId] = {
            x: playerX,
            y: playerY,
            nick: nick,
            direction: 'w',
            traces: [ { x: playerX, y: playerY } ],
            score: 1
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            nick: nick,
            x: playerX,
            y: playerY
        });
    }
    function removePlayer(command) {
        let playerId = command.playerId
        if (!state.players[playerId]) return;

        notifyAll({
            type: 'remove-player',
            playerId: playerId,
            traces: state.players[playerId].traces
        })

        delete state.players[playerId]
    }

    function resetGame(command) {
        state.fruits = {}
        state.messages = []

        notifyAll({
            type: 'reset-game',
        })
    }

    return {
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
        message
    }
}