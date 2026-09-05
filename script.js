document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const replayBtn = document.getElementById('replay-btn');
    
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    
    const memoryCards = document.querySelectorAll('.memory-card');

    // Confetti Setup
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let isConfettiActive = false;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.vy += 0.05; // gravity
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height / 2);
            this.speed = Math.random() * 3 + 4;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            this.exploded = false;
        }

        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.explode();
                }
            }
        }

        draw() {
            if (!this.exploded) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        explode() {
            this.exploded = true;
            for (let i = 0; i < 50; i++) {
                particles.push(new FireworkParticle(this.x, this.y, this.color));
            }
        }
    }

    let fireworks = [];

    function createParticles() {
        // Particles are created dynamically when fireworks explode
    }

    function animateConfetti() {
        if (!isConfettiActive) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 5% chance every frame to launch a new firework
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].exploded) {
                fireworks.splice(i, 1);
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateConfetti);
    }

    // Screen Transitions
    function switchScreen(hideScreen, showScreen, callback) {
        hideScreen.classList.remove('active');
        hideScreen.classList.add('hidden');
        
        setTimeout(() => {
            showScreen.classList.remove('hidden');
            showScreen.classList.add('active');
            if (callback) callback();
        }, 1000); // Wait for transition
    }

    startBtn.addEventListener('click', () => {
        switchScreen(screen1, screen2, () => {
            // Sequential reveal of memory cards
            memoryCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('hidden');
                }, 500 + (index * 1500));
            });
            // Reveal next button after cards
            setTimeout(() => {
                nextBtn.classList.remove('hidden');
                nextBtn.classList.add('fade-in-up');
            }, 500 + (memoryCards.length * 1500) + 1000);
        });
    });

    nextBtn.addEventListener('click', () => {
        switchScreen(screen2, screen3, () => {
            isConfettiActive = true;
            createParticles();
            animateConfetti();
        });
    });

    replayBtn.addEventListener('click', () => {
        isConfettiActive = false;
        particles = [];
        
        // Reset screen 2 elements
        memoryCards.forEach(card => card.classList.add('hidden'));
        nextBtn.classList.add('hidden');
        nextBtn.classList.remove('fade-in-up');

        switchScreen(screen3, screen1);
    });
});
