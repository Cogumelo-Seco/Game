export default function chat(state, socket, cookie) {
    document.getElementById('chat-button').addEventListener('click', openCloseChat);
    
    const chatContent = document.getElementById('chat-content')

    const chatButton = document.getElementById('chat-button')
    const unreadMessageCounter = document.getElementById('unreadMessageCounter')
    const messageBox = document.getElementById('message-box')
    const sendButton = document.getElementById('send-button')
    const chat = document.getElementById('chat')   
    
    function focusin(event) {        
        if (state.game) {
            for (let i in state.game.state.messages) {
                if (!state.game.state.messages[i].read) {
                    state.game.state.messages[i].read = true
                    chatContent.scrollTop = chatContent.scrollHeight
                }                
            }
            state.game.state.unreadMessages = 0
        }
        unreadMessageCounter.style.display = 'none'
        chatButton.style.background = 'rgba(0, 0, 0, 0.658) url(/images/chat.png) no-repeat center 0px / 100%'

        chat.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
        chat.style.borderColor = 'black'
        messageBox.style.backgroundColor = cookie.darkTheme == 'true' ? 'rgba(63, 63, 63, 1)' : 'rgba(255, 255, 255, 1)';
        sendButton.style.backgroundColor = 'rgba(0, 150, 200, 1)'

        if (event.type == 'mouseover') state.onChat = 'over'
        else state.onChat = 'on'
    }

    function focusout(event) {
        if (!document.activeElement || document.activeElement.id != 'message-box') {
            chat.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
            chat.style.borderColor = 'transparent'
            messageBox.style.backgroundColor = cookie.darkTheme == 'true' ? 'rgba(63, 63, 63, 0.4)' : 'rgba(255, 255, 255, 0.5)';
            sendButton.style.backgroundColor = 'rgba(0, 150, 200, 0.3)'
            state.onChat = 'off'
        }
    }

    messageBox.addEventListener('focusin', focusin);
    messageBox.addEventListener('focusout', focusout);
    chat.addEventListener('mouseover', focusin)
    chat.addEventListener('mouseout', focusout)

    sendButton.addEventListener('click', send);

    function openCloseChat() {
        if (chat.style.display == 'none' || chat.style.display == '') {
            chat.style.display = 'block'
            messageBox.focus()
            setTimeout(() => messageBox.value = '', 50)
        } else chat.style.display = 'none'
    }

    function send() {
        let content = messageBox.value
        if (!content) return;        

        socket.emit('message', {
            playerId: state.playerId,
            read: false,
            content,
        })
        messageBox.value = ''
    }

    function keyPressed(keyPressed) {
        // Enviar mensagem com enter
        if (document.activeElement.id == 'message-box' && keyPressed == 'Enter' && messageBox.value.trim()) send()

        // Abrir chat com /
        if (document.activeElement.id != 'message-box' && keyPressed == '/') {
            chat.style.display = 'block'
            messageBox.focus()
            setTimeout(() => messageBox.value = '', 50)
        }

        // Fechar chat aberto com ESC
        if(document.activeElement.id == 'message-box' && keyPressed == 'Escape') openCloseChat()
    }

    return {
        keyPressed,
        openCloseChat,
        send
    }
}