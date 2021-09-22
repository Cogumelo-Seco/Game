module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const chatContent = document.getElementById('chat-content')
    const chatButton = document.getElementById('chat-button')
    const chat = document.getElementById('chat')

    chatContent.innerHTML = ''
    let messages = []
    for (let i in game.state.messages) {
        let message = game.state.messages[i]
        let filter = messages.filter((m) => m.nick == message.nick && m.content == message.content)
        if (!filter[0]) messages.push(message)
    }
    game.state.messages = messages
    for (let i in messages) {
        let message = messages[i]

        if (!message.read && chat.style.display == 'block') message.read = true;
        if (!message.read) chatButton.style.background = 'rgb(242, 242, 242) url(/images/unreadChat.png) no-repeat center 0px / 100%'
        else chatButton.style.background = 'rgb(242, 242, 242) url(/images/chat.png) no-repeat center 0px / 100%'

        let color1 = 'rgb(0, 229, 255)'
        let color2 = 'white'
        
        let emoji = ''
        if (scoreArr[0].nick == message.nick) color1 = 'rgb(255, 196, 48)'
        if (!message.nick) {
            message.color = 'gray'
            message.nick = 'Morto'
        }
        if (scoreArr[0].nick == message.nick) emoji = '👑'
        if (message.system) emoji = '⚙️'

        chatContent.innerHTML += `
            <a id="Name" style="color: ${message.color ? message.color : color1}">${message.nick} ${emoji}</a>
            <a id="Message" style="color: ${color2}">${message.content}</a>
        `
    }
}