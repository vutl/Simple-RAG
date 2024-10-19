document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const bgUpload = document.getElementById('bg-upload');
    const changeBgBtn = document.getElementById('change-bg-btn');
    const resetBgBtn = document.getElementById('reset-bg-btn');

    const API_KEY = 'hTRJmMAS.EdRCRNa1L5L6ShCM5bWaonu36Uokectj';

    const URL = 'https://payload.vextapp.com/hook/AN3PDMANNO/catch/$(channel_token)';

    const initialBgUrl = 'DSCF9531.JPG'; 

    document.body.style.backgroundImage = `url(${initialBgUrl})`;

    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message !== '') {
            appendMessage('user', message);
            userInput.value = '';
            sendMessageToAPI(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            sendBtn.click();
        }
    });

    changeBgBtn.addEventListener('click', () => {
        bgUpload.click();
    });

    resetBgBtn.addEventListener('click', () => {
        document.body.style.backgroundImage = `url(${initialBgUrl})`;
    });

    bgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.body.style.backgroundImage = `url(${event.target.result})`;
            };
            reader.readAsDataURL(file);
        }
    });

    function appendMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.innerHTML = parseMessage(message);

        const timestamp = document.createElement('div');
        timestamp.classList.add('message-timestamp');
        timestamp.innerText = new Date().toLocaleTimeString();

        contentDiv.appendChild(bubbleDiv);
        contentDiv.appendChild(timestamp);

        if (sender === 'user') {
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(avatarDiv);
        } else {
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
        }

        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function sendMessageToAPI(message) {

        showTypingIndicator();

        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': `Api-Key ${API_KEY}`,
            },
            body: JSON.stringify({ payload: message }),
        })
            .then((response) => response.json())
            .then((data) => {

                removeTypingIndicator();

                if (data && data.text) {
                    appendMessage('bot', data.text);
                } else {
                    appendMessage(
                        'bot',
                        'Sorry, I did not understand that.'
                    );
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                removeTypingIndicator();
                appendMessage(
                    'bot',
                    'An error occurred while processing your request.'
                );
            });
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing');
        typingDiv.setAttribute('id', 'typing-indicator');

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = `
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        `;

        bubbleDiv.appendChild(typingIndicator);
        contentDiv.appendChild(bubbleDiv);

        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);

        chatWindow.appendChild(typingDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            chatWindow.removeChild(typingDiv);
        }
    }

    function parseMessage(message) {

        const div = document.createElement('div');
        div.textContent = message;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
});
