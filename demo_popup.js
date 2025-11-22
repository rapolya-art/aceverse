document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('demo-modal');
    const closeButton = document.getElementById('close-modal');
    const demoForm = document.getElementById('demo-form');
    const demoButtons = document.querySelectorAll('.cta-button, .nav-cta'); // Select all demo buttons

    // Open modal
    demoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            // Add a small delay to trigger the fade-in animation if we were using CSS transitions
            // For now, simple display toggle
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

        const submitButton = demoForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Надсилання...';
        submitButton.disabled = true;

        const templateParams = {
            name: document.getElementById('user_name').value,
            contact: document.getElementById('user_contact').value
        };

        emailjs.send('service_8anshhg', 'template_sqxta38', templateParams)
            .then(function () {
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
});
