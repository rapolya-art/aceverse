(function () {
    function initPopup() {
        console.log('Initializing Demo Popup...');
        const modal = document.getElementById('demo-modal');
        const closeButton = document.getElementById('close-modal');
        const demoForm = document.getElementById('demo-form');
        const demoButtons = document.querySelectorAll('.cta-button, .nav-cta');

        console.log(`Found ${demoButtons.length} demo buttons.`);

        if (typeof emailjs !== 'undefined') {
            emailjs.init({
                publicKey: "Nt6Mh1FjFbCzbX5wT",
            });
        } else {
            console.error('EmailJS library not loaded despite defer!');
        }

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
            console.log('Submitting form...');

            const submitButton = demoForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Надсилання...';
            submitButton.disabled = true;

            const templateParams = {
                name: document.getElementById('user_name').value,
                contact: document.getElementById('user_contact').value
            };

            if (typeof emailjs === 'undefined') {
                console.error('EmailJS not loaded!');
                alert('Помилка: сервіс відправки не завантажено.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                return;
            }

            emailjs.send('service_8anshhg', 'template_sqxta38', templateParams)
                .then(function () {
                    console.log('Email sent successfully');
                    alert('Дякуємо! Ваша заявка успішно надіслана.');
                    modal.style.display = 'none';
                    demoForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, function (error) {
                    console.error('FAILED...', error);
                    alert('Виникла помилка при відправці. Спробуйте пізніше.');
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
