const socket = io();

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

    document.getElementById('message').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
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
