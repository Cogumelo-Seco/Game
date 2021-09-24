module.exports = (game) => {
    const left = document.querySelector('.observedPlayerSelectionArrows.left')
    const right = document.querySelector('.observedPlayerSelectionArrows.right')
    
    left.addEventListener('click', () => {
        const players = Object.keys(game.state.players)
        let playerId = null
        function getPlayerId(number) {
            playerId = players[number]
            if (game.state.players[playerId]?.dead) {
                game.state.observedNumber = game.state.observedNumber < 0 ? players.length-1 : number-1
                getPlayerId(game.state.observedNumber < 0 ? players.length-1 : number-1)
            }
            return playerId
        }

        game.state.observedNumber--
        if (game.state.observedNumber < 0) game.state.observedNumber = players.length-1
        getPlayerId(game.state.observedNumber)
        game.state.observedPlayerId = playerId
    })

    right.addEventListener('click', () => {
        const players = Object.keys(game.state.players)
        let playerId = null
        function getPlayerId(number) {
            playerId = players[number]
            if (game.state.players[playerId]?.dead) {
                game.state.observedNumber = game.state.observedNumber > players.length-1 ? 1 : number+1
                getPlayerId(game.state.observedNumber > players.length-1 ? 1 : number+1)
            }
            return playerId
        }

        game.state.observedNumber++
        if (game.state.observedNumber > players.length-1) game.state.observedNumber = 0
        getPlayerId(game.state.observedNumber)
        game.state.observedPlayerId = playerId
    })
}