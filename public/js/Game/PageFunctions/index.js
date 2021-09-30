import renderScreen from '../RenderScreen/index.js';
import renderLow from '../RenderScreen/indexLow.js';

function Function(game, canvas, socket, Listener) {
    let playerId = socket.id
    game.state.myID = playerId
    renderScreen(canvas, game, requestAnimationFrame, Listener);
    renderLow(canvas, game, requestAnimationFrame, Listener);
    canvas.style.display = 'block';
    document.getElementById('miniMap').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('playerScore').style.display = 'block';
    document.getElementById('pingDisplay').style.display = 'block';
    document.getElementById('fpsDisplay').style.display = 'block';
    document.getElementById('loadingCircle').style.display = 'none'
    document.getElementById('scoreTable-button').style.display = 'block'
    if (socket.id == game.state.adm) document.getElementById('startButton').style.display = 'block'

    require('./observedPlayerSelectionArrows')(game)
    require('./scoreTableButton')(game)
    require('./mobileSettings')(game, Listener)
}

module.exports = Function