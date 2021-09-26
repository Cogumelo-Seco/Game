module.exports = (game) => {
    const scoreTableButton = document.getElementById('scoreTable-button')
    const scoreTable = document.getElementById('scoreTable')

    scoreTableButton.addEventListener('click', () => {
        if (scoreTable.style.display == 'none') scoreTable.style.display = 'table'
        else scoreTable.style.display = 'none'
    })
}