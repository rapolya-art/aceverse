(function () {
    const COLORS = [
        { r: 255, g: 255, b: 255 }, // White
        { r: 220, g: 200, b: 255 }, // Very Light Purple
        { r: 160, g: 111, b: 246 }, // The main Purple (#a06ff6)
        { r: 130, g: 80, b: 220 }  // Slightly darker purple
    ];

    function createAnimation(canvasId, type) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        // Handle resizing
        const resizeObserver = new ResizeObserver(() => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });
        resizeObserver.observe(canvas);

        const particles = [];
        const PARTICLE_COUNT = 30;
        const SPEED = 1.5;

        class Particle {
            constructor() {
                this.init(true);
            }

            init(randomProgress = false) {
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.size = Math.random() * 1.5 + 1; // 1 to 2.5px
                this.angle = Math.random() * Math.PI * 2;

                const maxDist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));

                if (type === 'inbound') {
                    // Start at edge, move to center
                    this.dist = randomProgress ? Math.random() * maxDist : maxDist;
                } else {
                    // Start at center, move to edge
                    this.dist = randomProgress ? Math.random() * maxDist : 0;
                }

                this.maxDist = maxDist;
            }

            update() {
                if (type === 'inbound') {
                    this.dist -= SPEED;
                    if (this.dist < 0) this.init();
                } else {
                    this.dist += SPEED;
                    if (this.dist > this.maxDist) this.init();
                }
            }

            draw() {
                const cx = width / 2;
                const cy = height / 2;

                const x = cx + Math.cos(this.angle) * this.dist;
                const y = cy + Math.sin(this.angle) * this.dist;

                // Opacity fade near center/edge
                let alpha = 1;
                if (type === 'inbound') {
                    // Fade out as it reaches center
                    alpha = Math.min(1, this.dist / 20);
                } else {
                    // Fade out as it reaches edge
                    alpha = 1 - (this.dist / this.maxDist);
                }

                // Also fade in when spawning
                if (type === 'inbound' && this.dist > this.maxDist - 10) {
                    alpha = Math.min(alpha, (this.maxDist - this.dist) / 10);
                } else if (type === 'outbound' && this.dist < 10) {
                    alpha = Math.min(alpha, this.dist / 10);
                }

                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // Initialize animations when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        createAnimation('inboundCanvas', 'inbound');
        createAnimation('outboundCanvas', 'outbound');
    });

})();
