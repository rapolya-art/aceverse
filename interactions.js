// Blur effect following mouse on cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const blobs = card.querySelectorAll('.blob');
        
        card.addEventListener('mousemove', function(e) {
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
        
        card.addEventListener('mouseleave', function() {
            blobs.forEach(blob => {
                blob.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    });

    // Mercury effect following mouse
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const mercuryBlobs = ctaSection.querySelectorAll('.mercury-blob');
        
        ctaSection.addEventListener('mousemove', function(e) {
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
});