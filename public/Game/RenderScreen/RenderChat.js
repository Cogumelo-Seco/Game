module.exports = (canvas, game, requestAnimationFrame, Listener, scoreArr) => {
    const chatContent = document.getElementById('chat-content')

    chatContent.innerHTML = ''
    let messages = game.state.messages
    for (let i in messages) {
        let message = messages[i]
        let color1 = 'rgb(0, 229, 255)'
        let color2 = 'white'
        let emoji = ''                
        if (scoreArr[0].nick == message.nick) color1 = 'rgb(255, 196, 48)'
        if (scoreArr[0].nick == message.nick) emoji = '👑'
        if (message.system) emoji = '⚙️'
        chatContent.innerHTML += `
            <a id="Name" style="color: ${message.color ? message.color : color1}">${message.nick} ${emoji}</a>
            <a id="Message" style="color: ${color2}">${message.content.replace(/\s+/g, ' ')}</a>`
    }
}