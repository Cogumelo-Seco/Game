export default function createKeyboardListener() {
    const state = {
        observers: [],
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
    document.getElementById('arrow-up').addEventListener("click", handlebuttons);
    document.getElementById('arrow-down').addEventListener("click", handlebuttons);
    document.getElementById('arrow-left').addEventListener("click", handlebuttons);
    document.getElementById('arrow-right').addEventListener("click", handlebuttons);

    function handleKeys(event) {
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
        if (event.toElement.id == 'arrow-up') state.direction = 'w'
        if (event.toElement.id == 'arrow-down') state.direction = 's'
        if (event.toElement.id == 'arrow-left') state.direction = 'a'
        if (event.toElement.id == 'arrow-right') state.direction = 'd'
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