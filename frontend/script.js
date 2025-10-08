document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const toggleChatBtn = document.getElementById('toggle-chat-btn');
    const chatContainer = document.querySelector('.chat-container');

    // --- CONFIGURATION ---
    // API URL will be injected during GitHub Pages deployment via secrets
    const API_URL = window.API_URL || 'YOUR_CLOUD_RUN_API_URL_HERE';

    // Function to add a message to the chat box
    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        if (sender === 'loading') {
            messageElement.innerHTML = '<div class="dot-flashing"></div>';
        } else {
            const p = document.createElement('p');
            p.textContent = text;
            messageElement.appendChild(p);
        }
        
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement;
    };

    // Function to handle sending a message
    const handleSendMessage = async () => {
        const query = userInput.value.trim();
        if (!query) return;

        if (!API_URL || API_URL === 'YOUR_CLOUD_RUN_API_URL_HERE') {
            addMessage("Error: API URL is not configured in script.js.", 'bot');
            return;
        }

        addMessage(query, 'user');
        userInput.value = '';
        const loadingMessage = addMessage('', 'loading');

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: query })
            });

            chatBox.removeChild(loadingMessage);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage(data.answer, 'bot');

        } catch (error) {
            console.error('Error:', error);
            if (loadingMessage.parentNode) {
                chatBox.removeChild(loadingMessage);
            }
            addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
        }
    };

    // Event Listeners
    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Resume download handler
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // You can update this path to your actual resume file
            const resumePath = '/users/downloads/mishal_resume.pdf';
            const link = document.createElement('a');
            link.href = resumePath;
            link.download = 'Mishal_Yadav_DevOps_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    toggleChatBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('closed');
    });
    document.querySelector('.chat-header').addEventListener('click', (e) => {
        // Prevent toggling when the button itself is clicked
        if (e.target.id !== 'toggle-chat-btn' && !e.target.closest('#toggle-chat-btn')) {
            chatContainer.classList.toggle('closed');
        }
    });
});
