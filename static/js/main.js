// =====================================================
// THIỆP CƯỚI ONLINE - JAVASCRIPT
// =====================================================

// 1. TỰ ĐỘNG LẤY NGÀY CƯỚI TỪ NGUỒN HTML DỮ LIỆU
const countdownEl = document.querySelector(".countdown");
let weddingDate;

if (countdownEl && countdownEl.getAttribute("data-date")) {
    const rawDateStr = countdownEl.getAttribute("data-date");
    const parsedDate = new Date(rawDateStr).getTime();
    weddingDate = isNaN(parsedDate) ? new Date("2026-12-20T17:30:00+07:00").getTime() : parsedDate;
} else {
    weddingDate = new Date("2026-12-20T17:30:00+07:00").getTime();
}

// 2. HÀM ĐẾM NGƯỢC COUNTDOWN
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// 3. QUẢN LÝ NHẠC NỀN
const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

if (music && musicButton) {
    let musicPlaying = false;
    music.volume = 0.35;

    function toggleMusic() {
        if (musicPlaying) {
            music.pause();
            musicButton.classList.remove("playing");
            musicButton.textContent = "♫";
            musicPlaying = false;
        } else {
            music.play()
                .then(() => {
                    musicButton.classList.add("playing");
                    musicButton.textContent = "❚❚";
                    musicPlaying = true;
                })
                .catch((error) => console.log("Không thể phát nhạc:", error));
        }
    }

    musicButton.addEventListener("click", toggleMusic);

    const enableAutoPlayOnInteraction = () => {
        if (!musicPlaying) {
            music.play().then(() => {
                musicButton.classList.add("playing");
                musicButton.textContent = "❚❚";
                musicPlaying = true;
            }).catch(() => {});
        }
        document.removeEventListener("click", enableAutoPlayOnInteraction);
    };

    document.addEventListener("click", enableAutoPlayOnInteraction, { once: true });
}

// 4. HIỆU ỨNG TRÁI TIM / CÁNH HOA RƠI LUNG LINH
const canvas = document.getElementById("particle-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 1.2 + 0.6;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.rotation = Math.random() * 360;
            this.spin = Math.random() * 2 - 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.spin;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = "#c9b18c";

            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
            ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < 30; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// 5. XỬ LÝ SLIDESHOW ẢNH
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('slideDots');

if (slides.length > 0) {
    let currentIndex = 0;
    let autoSlideTimer = null;

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlideshow() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlideshow();
        resetAutoSlide();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlideshow();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlideshow();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 4500);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    updateSlideshow();
    startAutoSlide();
}

// 6. XỬ LÝ TƯƠNG TÁC MỞ BAO THƯ & SCROLL REVEAL
document.addEventListener('DOMContentLoaded', function () {
    const revealElements = document.querySelectorAll('.scroll-reveal, section, footer');

    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const envelopeBox = document.getElementById('envelopeBox');

    if (envelopeOverlay && envelopeBox) {
        let isOpened = false;

        envelopeOverlay.addEventListener('click', function () {
            if (isOpened) return;
            isOpened = true;

            envelopeBox.classList.add('open');

            setTimeout(() => {
                envelopeOverlay.classList.add('fade-out');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    envelopeOverlay.style.display = 'none';
                    window.dispatchEvent(new Event('scroll'));
                }, 1000);
            }, 1000);
        });
    }
});