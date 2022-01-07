module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    const scoreTable = document.getElementById('scoreTable')
    scoreTable.innerHTML = ''

    let scores = scoreArr.splice(0, 10)
    for (let i in scores) {
        let player = document.createElement('tr');
        player.innerHTML = `<th id="Name">${scores[i].nick}</th><th id="Score">${scores[i].score}</th>`
        scoreTable.appendChild(player)
    }
}