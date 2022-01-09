import chat from './Listener/Chat.js';
import Joystick from './Listener/Joystick.js';

export default function createListener() {
    const state = {
        observers: [],
        onChat: false,
        playerId: null,
        zoom: 10,
        cooldown: 0,
        keys: {
            w: { cooldown: 0 },
            a: { cooldown: 0 },
            s: { cooldown: 0 },
            d: { cooldown: 0 },
        },
        pressedKeys: {},
        mobile: false
    }

    const registerSettings = (settings) => {
        for (let i in settings) {
            state[i] = settings[i]
        }
    }

    const subscribe = (observerFunction) => state.observers.push(observerFunction)

    const notifyAll = (command) => {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) state.mobile = true

    const chatFunctions = chat(state, notifyAll)
    Joystick(state, movePlayer)

    document.addEventListener('keydown', handleKeys)
    document.addEventListener('keydown', (e) => state.pressedKeys[e.key] = true)
    document.addEventListener('keyup', (e) => state.pressedKeys[e.key] = false)

    function zoom(key) {
        if (key == '-' && state.zoom > 3) state.zoom -= state.zoom ** 0.9 / 10
        else if (key == '+' && state.zoom < 60) state.zoom += state.zoom ** 0.9 / 10
    }

    function scoreTable(key) {
        if (key == '*') {
            let scoreTable = document.getElementById('scoreTable')
            if (scoreTable.style.display == 'none') scoreTable.style.display = 'table'
            else scoreTable.style.display = 'none'
        }
    }

    function handleKeys(event, sensitivity) {
        let keyPressed = event.key        

        chatFunctions.keyPressed(keyPressed, state, notifyAll)
        
        if (state.onChat) return;

        zoom(keyPressed)
        scoreTable(keyPressed)
    }

    function movePlayer(keyPressed, sensitivity) {
        sensitivity = sensitivity ? 1070-sensitivity : 70

        function getMoveKey(keyPressed) {
            switch(keyPressed) {
                case 'ArrowUp':
                    keyPressed = 'w'
                    break
                case 'ArrowDown':
                    keyPressed = 's'
                    break
                case 'ArrowLeft':
                    keyPressed = 'a'
                    break
                case 'ArrowRight':
                    keyPressed = 'd'
                    break
            }
            return keyPressed
        }
        if (state.keys[getMoveKey(keyPressed)] && +new Date()-state.keys[getMoveKey(keyPressed)].cooldown > sensitivity) {
            state.keys[getMoveKey(keyPressed)].cooldown = +new Date()

            notifyAll({
                type: 'move-player',
                player: state.game.state.players[state.playerId],
                playerId: state.playerId,
                keyPressed,
                serverId: state.serverId
            })
        }
    }

    setInterval(() => {
        for (let key in state.pressedKeys) {
            if (state.pressedKeys[key]) movePlayer(key)
        }
    }, 50)

    return {
        subscribe,
        registerSettings,
        notifyAll,
        state
    }
}