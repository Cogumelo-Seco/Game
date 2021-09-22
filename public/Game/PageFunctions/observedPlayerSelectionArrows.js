module.exports = (game) => {
    const left = document.querySelector('.observedPlayerSelectionArrows.left')
    const right = document.querySelector('.observedPlayerSelectionArrows.right')
    
    left.addEventListener('click', () => {
        const players = Object.keys(game.state.players)

        game.state.observedNumber--
        if (game.state.observedNumber < 0) game.state.observedNumber = players.length-1
        game.state.myID = players[game.state.observedNumber]
    })

    right.addEventListener('click', () => {
        const players = Object.keys(game.state.players)

        game.state.observedNumber++
        if (game.state.observedNumber > players.length-1) game.state.observedNumber = 0
        game.state.myID = players[game.state.observedNumber]
    })
}