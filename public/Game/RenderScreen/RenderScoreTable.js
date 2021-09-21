module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    scoreTable.innerHTML = ''
    for (let i in scoreArr) {
        let player = document.createElement('tr');
        player.innerHTML = `<th id="Name">${scoreArr[i].nick}</th><th id="Score">${scoreArr[i].score}</th>`
        if (i < 10) scoreTable.appendChild(player)
    }
}