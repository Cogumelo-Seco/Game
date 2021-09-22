import renderScreen from '../RenderScreen/index.js';

function Function(game, canvas, socket, Listener) {
    let playerId = socket.id
    game.state.myID = playerId
    renderScreen(canvas, game, requestAnimationFrame, Listener);
    canvas.style.display = 'inline-block';
    document.getElementById('timer').style.display = 'inline-block';

    require('./observedPlayerSelectionArrows')(game)
}

module.exports = Function