module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const myPlayer = game.state.players[game.state.myID]

    if (myPlayer.dead) {
        document.getElementById('playerViewSelection').style.display = 'block'

        const player = game.state.players[game.state.observedPlayerId]

        const myPlayerScore = document.getElementById('playerScore')
        const playerName = document.getElementById('nameOfSelectedPlayer')
        const playerScore = document.getElementById('scoreOfSelectedPlayer')

        myPlayerScore.innerText = 'Morto'
        myPlayerScore.style.backgroundColor = 'rgba(255, 0, 0, 0.658)'

        playerName.innerText = player.nick

        playerScore.innerText = `Score: ${player.score}`
    }
}