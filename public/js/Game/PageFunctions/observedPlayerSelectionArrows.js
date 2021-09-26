module.exports = (game) => {
    const left = document.querySelector('.observedPlayerSelectionArrows.left')
    const right = document.querySelector('.observedPlayerSelectionArrows.right')
    
    left.addEventListener('click', () => {
        let players = []
        for (let i in game.state.players) {
            if (game.state.players[i] && !game.state.players[i].dead) players.push(i)
        }
        game.state.observedNumber--
        if (game.state.observedNumber < 0) game.state.observedNumber = players.length-1
        game.state.observedPlayerId = players[game.state.observedNumber]
    })

    right.addEventListener('click', () => {
        let players = []
        for (let i in game.state.players) {
            if (game.state.players[i] && !game.state.players[i].dead) players.push(i)
        }
        game.state.observedNumber++
        if (game.state.observedNumber > players.length-1) game.state.observedNumber = 0
        game.state.observedPlayerId = players[game.state.observedNumber]
    })
}