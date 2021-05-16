export default function createKeyboardListener() {
    const state = {
        observers: [],
        playerId: null,
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
            keyPressed
        }

        notifyAll(command)
    }

    function handlebuttons(event) {
        if (event.toElement.id == 'arrow-up') var key = 'w'
        if (event.toElement.id == 'arrow-down') var key = 's'
        if (event.toElement.id == 'arrow-left') var key = 'a'
        if (event.toElement.id == 'arrow-right') var key = 'd'
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed: key
        }
        notifyAll(command)
    }

    return {
        subscribe,
        registerPlayerId,
        notifyAll
    }
}