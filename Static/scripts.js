const socket = io();
let typingTimer;
const typingInterval = 1000; // 1 second

document.addEventListener('DOMContentLoaded', () => {
    const username = "{{ username }}";
    const messageInput = document.getElementById('message');
    const messagesContainer = document.getElementById('messages');
    const usersList = document.getElementById('users');

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.timestamp} - ${message.username}: ${message.msg}`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    socket.on('user_connected', (username) => {
        const userElement = document.createElement('li');
        userElement.textContent = username;
        usersList.appendChild(userElement);
    });

    socket.on('user_disconnected', (username) => {
        const userElements = usersList.getElementsByTagName('li');
        for (let userElement of userElements) {
            if (userElement.textContent === username) {
                usersList.removeChild(userElement);
                break;
            }
        }
    });

    socket.on('user_typing', (username) => {
        const typingElement = document.getElementById('typing');
        typingElement.textContent = `${username} is typing...`;
        setTimeout(() => {
            typingElement.textContent = '';
        }, 2000);
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        } else {
            socket.emit('typing');
        }
    });
});

function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    if (message) {
        socket.send(message);
        messageInput.value = '';
    }
}
