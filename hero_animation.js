(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let points = [];

    // Configuration
    const SPACING = 40; // Grid spacing
    const MOUSE_RADIUS = 200; // Radius of "Order"
    const CHAOS_AMOUNT = 19; // Almost touching edges (SPACING/2 = 20)
    const CHAOS_SPEED = 0.008; // Visible, active movement

    // Mouse/Touch state
    let mouse = { x: null, y: null };
    let time = 0;

    class Point {
        constructor(x, y) {
            this.baseX = x;
            this.baseY = y;
            this.x = x;
            this.y = y;
            this.size = 1.5;
            // Random offsets for chaos
            this.phaseX = Math.random() * Math.PI * 2;
            this.phaseY = Math.random() * Math.PI * 2;
            // Multiple frequencies for less predictable motion
            this.freq1 = Math.random() * 0.5 + 0.5;
            this.freq2 = Math.random() * 0.5 + 0.5;
        }

        update() {
            // 1. Calculate Chaotic Position
            // Mix two sine waves for more "random" looking drift within bounds
            // Result is normalized to approx -1 to 1 range then scaled
            let waveX = Math.sin(time * CHAOS_SPEED * this.freq1 + this.phaseX);
            let waveY = Math.cos(time * CHAOS_SPEED * this.freq2 + this.phaseY);

            let chaosX = waveX * CHAOS_AMOUNT;
            let chaosY = waveY * CHAOS_AMOUNT;

            let targetX = this.baseX + chaosX;
            let targetY = this.baseY + chaosY;
            let ease = 0.05; // Default slow ease for chaos

            // 2. Interaction (Order)
            if (mouse.x != null) {
                let dx = mouse.x - this.baseX; // Check distance to GRID position, not current
                let dy = mouse.y - this.baseY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MOUSE_RADIUS) {
                    // Calculate "Order Factor"
                    let orderFactor = 1 - (distance / MOUSE_RADIUS);

                    // Use a root power (e.g., 0.2) to keep the factor close to 1 for most of the radius
                    // This creates a large "plateau" of order that falls off quickly only at the very edge
                    orderFactor = Math.pow(orderFactor, 0.2);

                    // Interpolate towards base position
                    targetX = this.baseX + chaosX * (1 - orderFactor);
                    targetY = this.baseY + chaosY * (1 - orderFactor);

                    // Snappier movement when ordering
                    ease = 0.2;
                }
            }

            // 3. Move point towards target (Smooth damping)
            this.x += (targetX - this.x) * ease;
            this.y += (targetY - this.y) * ease;
        }

        draw() {
            ctx.fillStyle = 'rgba(160, 111, 246, 0.6)'; // Purple tint
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        points = [];

        // Create grid
        const cols = Math.ceil(width / SPACING) + 2;
        const rows = Math.ceil(height / SPACING) + 2;

        const startX = (width - (cols - 1) * SPACING) / 2;
        const startY = (height - (rows - 1) * SPACING) / 2;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                points.push(new Point(startX + x * SPACING, startY + y * SPACING));
            }
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        time += 1;

        points.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // Event Listeners
    window.addEventListener('resize', () => {
        resize();
        init();
    });

    // Mouse Events
    window.addEventListener('mousemove', (e) => {
        if (e.clientY < height) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        } else {
            mouse.x = null;
            mouse.y = null;
        }
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Touch Events (Mobile)
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Start
    init();
    animate();

})();
