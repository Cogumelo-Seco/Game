module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const chatContent = document.getElementById('chat-content')
    const chatButton = document.getElementById('chat-button')
    const unreadMessageCounter = document.getElementById('unreadMessageCounter')
    const chat = document.getElementById('chat')

    chatContent.innerHTML = ''
    let messages = []
    for (let i in game.state.messages) {
        let message = game.state.messages[i]
        let filter = messages.filter((m) => m.nick == message.nick && m.content == message.content)
        if (!filter[0]) messages.push(message)
    }
    let unreadMessages = 0
    game.state.messages = messages
    for (let i in messages) {
        let message = messages[i]

        if (!message.read && chat.style.display == 'block') message.read = true;
        if (!message.read) {
            unreadMessages++
            chatButton.style.background = 'rgb(242, 242, 242) url(/images/unreadChat.png) no-repeat center 0px / 100%'
        } else chatButton.style.background = 'rgb(242, 242, 242) url(/images/chat.png) no-repeat center 0px / 100%'

        let nameAdditionalCSS = null
        let messageAdditionalCSS = null

        if (scoreArr[0].nick == message.nick) message.color = 'rgb(255, 196, 48)'
        if (message.playerId && game.state.players[message.playerId] && game.state.players[message.playerId].dead) {
            message.emoji = '👻'
            message.color = 'gray'
            message.color2 = 'red'
            nameAdditionalCSS = 'text-decoration: line-through'
        }
        if (scoreArr[0].nick == message.nick) message.emoji = '👑'

        chatContent.innerHTML += `
            <a id="Name" style="color: ${message.color || 'rgb(0, 229, 255)'} ${nameAdditionalCSS ? ';'+nameAdditionalCSS : ''}">${message.nick} ${message.emoji || ''}</a>
            <a id="Message" style="color: ${message.color2 || 'white'} ${messageAdditionalCSS ? ';'+messageAdditionalCSS : ''}">${message.content}</a>
        `
    }
    if (unreadMessages > 0) {
        unreadMessageCounter.style.display = 'flex'
        unreadMessageCounter.innerText = unreadMessages
    } else unreadMessageCounter.style.display = 'none'
}