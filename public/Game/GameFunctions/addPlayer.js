module.exports = (command, state, notifyAll) => {
    const playerX = command.x || Math.floor(Math.random()*state.screen.height);
    const playerY = command.y || Math.floor(Math.random()*state.screen.width);
    const playerId = command.playerId
    let nick = command['nick']

    state.players[playerId] = {
        x: playerX,
        y: playerY,
        nick: nick,
        bot: false,
        direction: 'w',
        traces: [ { x: playerX, y: playerY } ],
        score: 1
    }

    notifyAll({
        type: 'add-player',
        playerId: playerId,
        nick: nick,
        x: playerX,
        y: playerY
    });
}