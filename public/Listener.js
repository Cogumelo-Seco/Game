export default function createListener(socket) {
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
        console.log(state.observers.length)
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
        if (!messageBox.value.trim()) return;
        notifyAll({
            type: 'message',
            playerId: state.playerId,
            content: messageBox.value.trim(),
        })
        messageBox.value = ''
    }

    function handleKeys(event) {
        if (state.message) {
            if (event.key == 'Enter' && messageBox.value.trim()) {
                let msg = messageBox.value.trim()
                let splitWords = msg.split(' ')
                for (let i = 0; i < splitWords.length;i++) {
                    let splitLetters = splitWords[i].split('')
                    for (let i = 0; i < splitLetters.length;i++) {
                        if (!/[A-Za-z0-9.,;:´`^~"'+-=%$&*#@!-°º()?/áéíóúãõâêîôûç]/.test(splitLetters[i])) splitLetters[i] = ''
                    }
                    splitWords[i] = splitLetters.join('')
                }
                msg = splitWords.join(' ').substring(0, 15)
                if (msg.trim()) notifyAll({
                    type: 'message',
                    playerId: state.playerId,
                    content: msg.trim(),
                })
                messageBox.value = ''
            }
            return;
        }
        document.getElementById('chat').style.display = 'inline-block';
        const keyPressed = event.key
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            ping: +new Date(),
            keyPressed
        }
        notifyAll(command)
    }

    function handlebuttons(event) {
        if (state.message) return;
        if (event.toElement.id == 'arrow-up') state.direction = 'w'
        if (event.toElement.id == 'arrow-down') state.direction = 's'
        if (event.toElement.id == 'arrow-left') state.direction = 'a'
        if (event.toElement.id == 'arrow-right') state.direction = 'd'
        state.message = false
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            ping: +new Date(),
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