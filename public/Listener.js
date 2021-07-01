export default function createListener() {
    const state = {
        observers: [],
        message: false,
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handleKeys);
    document.getElementById('send-button').addEventListener("click", send);
    document.getElementById('chat-button').addEventListener("click", chat);
    document.getElementById('arrow-up').addEventListener("click", handlebuttons);
    document.getElementById('arrow-down').addEventListener("click", handlebuttons);
    document.getElementById('arrow-left').addEventListener("click", handlebuttons);
    document.getElementById('arrow-right').addEventListener("click", handlebuttons);
    document.getElementById('message-box').addEventListener('focus', onMessage);
    document.getElementById('screen').addEventListener('click', offMessage);
    const messageBox = document.getElementById('message-box')

    function chat() {
        if (state.message) {
            state.message = false
            document.getElementById('chat').style.display = 'none'
        } else {
            state.message = true
            document.getElementById('chat').style.display = 'inline-block'
        }
    }
    function onMessage() {
        state.message = true
    }
    function offMessage() {
        state.message = false
    }

    function send() {
        let content = messageBox.value.replace(/\s+/g, ' ')
        if (!content) return;
        notifyAll({
            type: 'message',
            playerId: state.playerId,
            content,
        })
        messageBox.value = ''
    }

    function handleKeys(event) {
        if (state.message && event.key == 'Enter' && messageBox.value.trim()) return send()
        document.getElementById('chat').style.display = 'inline-block';
        const keyPressed = event.key
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }
        notifyAll(command)
    }

    function handlebuttons(event) {
        state.message = false
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
        notifyAll
    }
}