export default function chat(state, socket) {
    document.getElementById('chat-button').addEventListener('click', openCloseChat);
    document.getElementById('send-button').addEventListener('click', send);
    
    const messageBox = document.getElementById('message-box')
    messageBox.addEventListener('focusin', () => state.onChat = true);
    messageBox.addEventListener('focusout', () => state.onChat = false);

    function openCloseChat() {
        const chat = document.getElementById('chat')
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
        if (state.onChat && keyPressed == 'Enter' && messageBox.value.trim()) send()

        // Abrir chat com /
        const chat = document.getElementById('chat')

        if (!state.onChat && keyPressed == '/') {
            chat.style.display = 'block'
            messageBox.focus()
            setTimeout(() => messageBox.value = '', 50)
        }

        // Fechar chat aberto com ESC
        if(state.onChat && keyPressed == 'Escape') openCloseChat()
    }

    return {
        keyPressed,
        openCloseChat,
        send
    }
}