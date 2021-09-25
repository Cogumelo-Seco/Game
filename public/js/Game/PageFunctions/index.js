import renderScreen from '../RenderScreen/index.js';

function Function(game, canvas, socket, Listener) {
    let playerId = socket.id
    game.state.myID = playerId
    renderScreen(canvas, game, requestAnimationFrame, Listener);
    canvas.style.display = 'inline-block';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('playerScore').style.display = 'block';
    document.getElementById('pingDisplay').style.display = 'block';
    document.getElementById('fpsDisplay').style.display = 'block';
    document.getElementById('chat-button').style.display = 'block';
    document.getElementById('loadingCircle').style.display = 'none'

    require('./observedPlayerSelectionArrows')(game)
}

module.exports = Function