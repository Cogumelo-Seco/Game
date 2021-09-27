module.exports = (canvas, game, Listener, scoreArr) => {
    let player = game.state.players[game.state.myID]
    if (player.dead) player = game.state.players[game.state.observedPlayerId]

    const playerScore = document.getElementById('playerScore');
    if (!player.dead) playerScore.innerText = `Score: ${player.score}`
}