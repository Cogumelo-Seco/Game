module.exports = (game, Listener) => {
    if (!Listener.state.mobile) return;

    let repetition = 0
    let interval = setInterval(() => {
        const scoreTable = document.querySelector('table#scoreTable')
        const scoreTableScore = document.querySelector('table#scoreTable th#Score')
        const miniMap = document.querySelector('canvas#miniMap')
        const chatButton = document.querySelector('button#chat-button')
        const unreadMessageCounter = document.querySelector('div#unreadMessageCounter')
        const chat = document.querySelector('div#chat')

        if (
            !scoreTable ||
            !scoreTableScore ||
            !miniMap ||
            !chatButton ||
            !unreadMessageCounter ||
            !chat
        ) return

        scoreTable.style.width = '140px'
        scoreTable.style.fontSize = '10px'
        scoreTableScore.style.width = '20px'
        miniMap.style.transform = 'translateY(0)'
        miniMap.style.top = '5px' 
        chatButton.style.left = '148px'
        unreadMessageCounter.style.left = '176px'
        chat.style.left = '193px'

        if (repetition >= 5) clearInterval(interval)
        repetition++
    }, 1000)
}