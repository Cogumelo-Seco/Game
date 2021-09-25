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
        mobile: false
    }

    const registerPlayerId = (playerId) => state.playerId = playerId

    const subscribe = (observerFunction) => state.observers.push(observerFunction)

    const notifyAll = (command) => {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) state.mobile = true

    const chatFunctions = chat(state, notifyAll)
    Joystick(state, handleKeys)

    document.addEventListener('keydown', handleKeys)

    function zoom(key) {
        if (key == '-' && state.zoom > 5) state.zoom--
        else if (key == '+' && state.zoom < 70) state.zoom++           
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
        sensitivity = sensitivity ? 1050-sensitivity : 50

        chatFunctions.keyPressed(keyPressed, state, notifyAll)
        
        if (state.onChat) return;

        zoom(keyPressed)
        scoreTable(keyPressed)

        // Move Player
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
                playerId: state.playerId,
                keyPressed
            })
        }
    }

    return {
        subscribe,
        registerPlayerId,
        notifyAll,
        state
    }
}