(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const PARTICLE_COUNT = 400; // Density of the stream
    const STREAM_SPEED = 2; // Speed of flow
    const FOV = 250; // Field of view for 3D projection
    const STAR_SIZE = 2; // Base size of particles

    // Colors Palette
    // We will use a mix of colors to match the "Chaos to Order" text gradient:
    // White (#FFFFFF) -> Light Purple -> Purple (#A06FF6)
    const COLORS = [
        { r: 255, g: 255, b: 255 }, // White
        { r: 220, g: 200, b: 255 }, // Very Light Purple
        { r: 160, g: 111, b: 246 }, // The main Purple (#a06ff6)
        { r: 130, g: 80, b: 220 }  // Slightly darker purple for depth
    ];

    class Particle {
        constructor(isInitial = false) {
            this.init(isInitial);
        }

        init(isInitial) {
            this.x = (Math.random() - 0.5) * width * 2;
            this.y = (Math.random() - 0.5) * height * 2;
            this.z = isInitial ? Math.random() * width : width;
            this.speed = STREAM_SPEED + Math.random() * 0.5;
            this.opacity = 0;

            // Assign a random color from the palette
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        update() {
            this.z -= this.speed;
            if (this.z <= 0) {
                this.init(false);
                this.z = width;
            }
        }

        draw() {
            const scale = FOV / (FOV + this.z);
            const x2d = (this.x * scale) + width / 2;
            const y2d = (this.y * scale) + height / 2;
            const size = STAR_SIZE * scale;

            // Opacity logic
            let alpha = 1 - (this.z / width);
            alpha = Math.pow(alpha, 3);

            if (alpha > 0) {
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle(true));
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.sort((a, b) => b.z - a.z);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    init();
    animate();

})();
