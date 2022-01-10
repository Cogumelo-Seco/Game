module.exports = (canvas, game, Listener, scoreArr, cookie) => {
    const chatContent = document.getElementById('chat-content')
    const chatButton = document.getElementById('chat-button')
    const unreadMessageCounter = document.getElementById('unreadMessageCounter')
    const chat = document.getElementById('chat')
    
    if (window.innerWidth <= 600) return

    chatContent.innerHTML = ''
    let messages = []
    for (let i in game.state.messages) {
        let message = game.state.messages[i]
        let filter = messages.filter((m) => m.nick == message.nick && m.content == message.content)
        if (!filter[0]) messages.push(message)
    }  
    game.state.messages = messages
    let unreadMessages = 0
    for (let i in messages) {
        let message = messages[i]

        if (!message.read && chat.style.display == 'block') message.read = true;
        if (!message.read) unreadMessages++

        let nameAdditionalCSS = null
        let messageAdditionalCSS = null

        if (scoreArr[0].nick == message.nick) message.color = 'rgb(255, 196, 48)'
        if (message.playerId && game.state.players[message.playerId] && game.state.players[message.playerId].dead) {
            message.emoji = '👻'
            message.color = 'gray'
            message.color2 = 'red'
            nameAdditionalCSS = 'text-decoration: line-through'
        }
        if (!message.system && !game.state.players[message.playerId]) {
            message.emoji = '🚫'
            message.color = 'gray'
            message.color2 = 'rgb(200, 200, 200)'
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
        chatButton.style.background = 'rgba(0, 0, 0, 0.658) url(/images/unreadChat.png) no-repeat center 0px / 100%'
    } else {
        unreadMessageCounter.style.display = 'none'
        chatButton.style.background = 'rgba(0, 0, 0, 0.658) url(/images/chat.png) no-repeat center 0px / 100%'
    }
}