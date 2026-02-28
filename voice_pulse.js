(function () {
    const canvas = document.getElementById('voicePulseCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const SIZE = 300;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let particles = [];
    let time = 0;

    // Load logo to sample particle positions
    const logoImg = new Image();
    logoImg.onload = function () {
        sampleLogo();
        animate();
    };
    logoImg.onerror = function () {
        createFallback();
        animate();
    };
    logoImg.src = '../assets/logo_particles.png';

    function sampleLogo() {
        const offscreen = document.createElement('canvas');
        const oCtx = offscreen.getContext('2d');
        const SAMPLE = 150;
        offscreen.width = SAMPLE;
        offscreen.height = SAMPLE;

        // Draw logo centered and fitted
        const aspect = logoImg.width / logoImg.height;
        let dw = SAMPLE, dh = SAMPLE;
        if (aspect > 1) { dh = SAMPLE / aspect; }
        else { dw = SAMPLE * aspect; }
        const dx = (SAMPLE - dw) / 2;
        const dy = (SAMPLE - dh) / 2;
        oCtx.drawImage(logoImg, dx, dy, dw, dh);

        const imageData = oCtx.getImageData(0, 0, SAMPLE, SAMPLE);
        const data = imageData.data;
        const step = 2;
        const scale = SIZE / SAMPLE;

        for (let y = 0; y < SAMPLE; y += step) {
            for (let x = 0; x < SAMPLE; x += step) {
                const i = (y * SAMPLE + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                if (a > 50 && !(r > 240 && g > 240 && b > 240)) {
                    particles.push({
                        baseX: x * scale,
                        baseY: y * scale,
                        size: 1.5 + Math.random() * 1.2,
                        r: r, g: g, b: b, a: a,
                        phase: Math.random() * Math.PI * 2,
                        speed: 1.2 + Math.random() * 3.5,
                        amp: 0.8 + Math.random() * 1.8
                    });
                }
            }
        }
    }

    function createFallback() {
        // Trefoil knot shape as fallback
        const cx = SIZE / 2, cy = SIZE / 2, R = SIZE * 0.35;
        for (let i = 0; i < 1500; i++) {
            const t = (i / 1500) * Math.PI * 2;
            const x = cx + (Math.sin(t) + 2 * Math.sin(2 * t)) * R * 0.35;
            const y = cy + (Math.cos(t) - 2 * Math.cos(2 * t)) * R * 0.35;
            const nx = (Math.random() - 0.5) * 10;
            const ny = (Math.random() - 0.5) * 10;
            const ratio = t / (Math.PI * 2);
            particles.push({
                baseX: x + nx,
                baseY: y + ny,
                size: 1 + Math.random() * 1.5,
                r: Math.round(100 + 60 * Math.sin(ratio * Math.PI * 2)),
                g: Math.round(60 + 50 * Math.sin(ratio * Math.PI * 2 + 2)),
                b: Math.round(180 + 66 * Math.sin(ratio * Math.PI * 2 + 4)),
                a: 200 + Math.round(Math.random() * 55),
                phase: Math.random() * Math.PI * 2,
                speed: 1.2 + Math.random() * 3.5,
                amp: 0.8 + Math.random() * 1.8
            });
        }
    }

    function animate() {
        time += 0.016;

        // Clear canvas (transparent bg so SVG background shows through)
        ctx.clearRect(0, 0, SIZE, SIZE);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Multiple sine waves for dynamic pulsation
            const w1 = Math.sin(time * p.speed + p.phase);
            const w2 = Math.sin(time * p.speed * 0.6 + p.phase * 1.5) * 0.6;
            const w3 = Math.sin(time * p.speed * 1.8 + p.phase * 0.6) * 0.4;
            const pulse = (w1 + w2 + w3) / 2.0;

            // Aggressive size pulsation — particles grow/shrink dramatically
            const sz = p.size * Math.max(0.1, 1 + pulse * p.amp);

            // Stronger jitter for lively feel
            const jx = Math.sin(time * 4 + p.phase) * 1.2;
            const jy = Math.cos(time * 3.5 + p.phase * 1.2) * 1.2;

            // Alpha swings wider
            const alphaBase = p.a / 255;
            const alpha = Math.max(0.05, Math.min(1, alphaBase * (0.3 + pulse * 0.7)));

            // Stronger brighten on pulse peaks
            const brighten = Math.max(0, pulse) * 80;
            const r = Math.min(255, p.r + brighten);
            const g = Math.min(255, p.g + brighten);
            const b = Math.min(255, p.b + brighten);

            ctx.beginPath();
            ctx.arc(p.baseX + jx, p.baseY + jy, sz, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            ctx.fill();

            // Glow halo — more visible, triggers more often
            if (pulse > 0.1 && alpha > 0.25) {
                ctx.beginPath();
                ctx.arc(p.baseX + jx, p.baseY + jy, sz * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (alpha * 0.15) + ')';
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    }
})();
