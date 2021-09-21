export default function chat(state, notifyAll) {
    document.getElementById('chat-button').addEventListener('click', chat);
    document.getElementById('send-button').addEventListener('click', send);
    
    const messageBox = document.getElementById('message-box')
    messageBox.addEventListener('focusin', () => state.onChat = true);
    messageBox.addEventListener('focusout', () => state.onChat = false);

    function chat() {
        const chat = document.getElementById('chat')
        if (chat.style.display == 'none' || chat.style.display == '') chat.style.display = 'block'
        else chat.style.display = 'none'
    }

    function send() {
        let content = messageBox.value
        if (!content) return;
        notifyAll({
            type: 'message',
            playerId: state.playerId,
            content,
        })
        messageBox.value = ''
    }

    return {
        send
    }
}