(function() {
    const messages = [
        { role: "ai", text: "Здравствуйте! Чем могу помочь?", delay: 1000 },
        { role: "user", text: "Я бы хотел узнать когда будет доставлен мой заказ.", delay: 2000, typing: true },
        { role: "ai", text: "Конечно! Для проверки статуса заказа мне понадобится номер заказа.", delay: 1500 },
        { role: "user", text: "Заказ #12345", delay: 1000, typing: true },
        { role: "ai", text: "Проверяю информацию по заказу #12345...", delay: 2000 },
        { role: "ai", text: "Ваш заказ находится в пути! Ожидаемая дата доставки: завтра, 13 октября.", delay: 2500 },
        { role: "user", text: "Отлично, спасибо!", delay: 1000, typing: true },
        { role: "ai", text: "Всегда рад помочь! Если возникнут вопросы — я на связи 24/7", delay: 1500 }
    ];

    function createMessage(role, text) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = role === 'ai' ? 'AI' : 'У';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        
        msg.appendChild(avatar);
        msg.appendChild(bubble);
        return msg;
    }

    function showTyping() {
        const indicator = document.querySelector('.typing-indicator-container');
        if (indicator) indicator.style.display = 'flex';
    }

    function hideTyping() {
        const indicator = document.querySelector('.typing-indicator-container');
        if (indicator) indicator.style.display = 'none';
    }

    async function typeText(text, element, speed = 80) {
        element.textContent = '';
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.style.display = 'inline-block';
        
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        if (cursor) cursor.style.display = 'none';
    }

    async function animateChat() {
        const chatArea = document.querySelector('.chat-area');
        const typingText = document.querySelector('.typing-text');
        
        if (!chatArea || !typingText) return;

        chatArea.innerHTML = '';
        const typingContainer = document.createElement('div');
        typingContainer.className = 'typing-indicator-container';
        typingContainer.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatArea.appendChild(typingContainer);
        
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            await new Promise(resolve => setTimeout(resolve, msg.delay));
            
            if (msg.role === 'ai') {
                showTyping();
                await new Promise(resolve => setTimeout(resolve, 1000));
                hideTyping();
                chatArea.appendChild(createMessage(msg.role, msg.text));
            } else if (msg.typing) {
                await typeText(msg.text, typingText);
                typingText.textContent = '';
                chatArea.appendChild(createMessage(msg.role, msg.text));
            }
            
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    // Ждём полной загрузки страницы, включая изображения
    if (document.readyState === 'complete') {
        setTimeout(animateChat, 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(animateChat, 1000);
        });
    }
})();