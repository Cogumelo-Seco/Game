module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    const myPlayer = game.state.players[game.state.myID]

    if (myPlayer.dead) {
        document.getElementById('playerViewSelection').style.display = 'block'

        const player = game.state.players[game.state.observedPlayerId]

        const playerName = document.getElementById('nameOfSelectedPlayer')
        const playerScore = document.getElementById('scoreOfSelectedPlayer')

        playerName.innerText = player.nick
        playerScore.innerText = `Score: ${player.score}`
    } else document.getElementById('playerViewSelection').style.display = 'none'
}