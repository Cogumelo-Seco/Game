import chat from './chat.js';

export default function createListener() {
    const state = {
        observers: [],
        onChat: false,
        playerId: null,
        zoom: 10,
        cooldown: 0,
        oldKeyPressed: '?'
    }

    const registerPlayerId = (playerId) => state.playerId = playerId

    const subscribe = (observerFunction) => state.observers.push(observerFunction)

    const notifyAll = (command) => {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    const chatFunctions = chat(state, notifyAll)

    document.addEventListener('keydown', handleKeys);
    /*document.getElementById('arrow-up').addEventListener("click", handlebuttons);
    document.getElementById('arrow-down').addEventListener("click", handlebuttons);
    document.getElementById('arrow-left').addEventListener("click", handlebuttons);
    document.getElementById('arrow-right').addEventListener("click", handlebuttons);*/

    function zoom(key) {
        if (key == '-' && state.zoom > 5) state.zoom--
        else if (key == '+' && state.zoom < 70) state.zoom++           
    }

    function handleKeys(event) {
        const messageBox = document.getElementById('message-box')
        const keyPressed = event.key

        // Abrir e feixar a tabela de score
        if (keyPressed == 'f') {
            let scoreTable = document.getElementById('scoreTable')
            if (scoreTable.style.display == 'none') scoreTable.style.display = 'table'
            else scoreTable.style.display = 'none'
        }

        // Send Message
        if (state.onChat && keyPressed == 'Enter' && messageBox.value.trim()) chatFunctions.send(state, notifyAll)

        // Zoom
        zoom(keyPressed)

        // Move Player
        if (state.onChat) return
        if (state.oldKeyPressed == keyPressed ? +new Date()-state.cooldown > 50 : true) {
            state.cooldown = +new Date()
            state.oldKeyPressed = keyPressed

            notifyAll({
                type: 'move-player',
                playerId: state.playerId,
                keyPressed
            })
        }
    }

    function handlebuttons(event) {
        state.onChat = false
        if (event.toElement.id == 'arrow-up') state.direction = 'w'
        if (event.toElement.id == 'arrow-down') state.direction = 's'
        if (event.toElement.id == 'arrow-left') state.direction = 'a'
        if (event.toElement.id == 'arrow-right') state.direction = 'd'
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed: state.direction
        }
        notifyAll(command)
    }

    return {
        subscribe,
        registerPlayerId,
        notifyAll,
        state
    }
}