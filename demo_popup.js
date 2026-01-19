(function () {
    function initPopup() {
        console.log('Initializing Demo Popup...');
        const modal = document.getElementById('demo-modal');
        const closeButton = document.getElementById('close-modal');
        const demoForm = document.getElementById('demo-form');
        const demoButtons = document.querySelectorAll('.cta-button, .nav-cta');

        console.log(`Found ${demoButtons.length} demo buttons.`);

        if (!modal || !closeButton || !demoForm) {
            console.error('Demo popup elements not found!');
            return;
        }

        // Open modal
        demoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Demo button clicked');
                modal.style.display = 'flex';
            });
        });

        // Close modal
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close on click outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle form submission
        demoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Submitting form to Telegram Proxy...');

            const submitButton = demoForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Надсилання...';
            submitButton.disabled = true;

            const formData = {
                name: document.getElementById('user_name').value,
                company: document.getElementById('company_name').value,
                phone: document.getElementById('user_phone').value,
                email: document.getElementById('user_email').value
            };

            // Check if running locally
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
                console.warn('Running locally: mock submission');
                setTimeout(() => {
                    alert('Це локальний запуск: форма не може відправити дані без бекенду Cloudflare. Після деплою це запрацює.');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    modal.style.display = 'none';
                    demoForm.reset();
                }, 1000);
                return;
            }

            fetch('/api/telegram-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            fetch('/api/telegram-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(async response => {
                    if (response.ok) {
                        console.log('Data sent successfully');
                        alert('Дякуємо! Ваша заявка успішно надіслана. Ми зв\'яжемося з вами найближчим часом.');
                        modal.style.display = 'none';
                        demoForm.reset();
                    } else {
                        const errorText = await response.text();
                        console.error('Server Error:', response.status, errorText);
                        throw new Error(`Server responded with ${response.status}: ${errorText}`);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`Помилка відправки: ${error.message}`);
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopup);
    } else {
        initPopup();
    }
})();
