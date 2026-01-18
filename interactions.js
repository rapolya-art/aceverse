// Blur effect following mouse on cards
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const blobs = card.querySelectorAll('.blob');

        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 0.5;
                const offsetX = (x - rect.width / 2) * speed;
                const offsetY = (y - rect.height / 2) * speed;

                blob.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + index * 0.1})`;
            });
        });

        card.addEventListener('mouseleave', function () {
            blobs.forEach(blob => {
                blob.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    });

    // Mercury effect following mouse
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const mercuryBlobs = ctaSection.querySelectorAll('.mercury-blob');

        ctaSection.addEventListener('mousemove', function (e) {
            const rect = ctaSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            mercuryBlobs.forEach((blob, index) => {
                const speed = (index + 1) * 0.3;
                const offsetX = (x - rect.width / 2) * speed * 0.05;
                const offsetY = (y - rect.height / 2) * speed * 0.05;

                const currentTransform = blob.style.transform || '';
                blob.style.transform = `${currentTransform} translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }

    // Header scroll visibility logic
    const bindHeaderScroll = () => {
        const header = document.querySelector('header');
        if (!header) {
            return false;
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight - 100) { // Show slightly before full scroll
                header.classList.add('header-visible');
            } else {
                header.classList.remove('header-visible');
            }
        });
        return true;
    };

    if (!bindHeaderScroll()) {
        const observer = new MutationObserver(() => {
            if (bindHeaderScroll()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // Expandable Block Logic
    const showMoreBtns = document.querySelectorAll('.show-more-btn');

    showMoreBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.previousElementSibling;
            content.classList.toggle('expanded');

            if (content.classList.contains('expanded')) {
                this.textContent = 'Приховати';
            } else {
                this.textContent = 'Показати все';
            }
        });
    });
    // Lazy Load Support Video
    const supportVideo = document.getElementById('support-video');
    if (supportVideo) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    supportVideo.play().catch(error => {
                        console.log("Video autoplay prevented:", error);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.7
        });

        videoObserver.observe(supportVideo);

        const unmuteBtn = document.getElementById('unmute-btn');
        if (unmuteBtn) {
            unmuteBtn.addEventListener('click', () => {
                supportVideo.muted = false;
                supportVideo.controls = true; // Enable native controls
                supportVideo.currentTime = 0;
                supportVideo.play().then(() => {
                    unmuteBtn.style.opacity = '0';
                    setTimeout(() => unmuteBtn.style.display = 'none', 300);
                }).catch(console.error);
            });
        }
    }
});