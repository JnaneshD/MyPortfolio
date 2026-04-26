// === Scroll Progress Bar ===
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const pct = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollBar) scrollBar.style.width = pct + '%';
}, { passive: true });

// === Nav scroll effect ===
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.pageYOffset > 100);
}, { passive: true });

// === Active nav link ===
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const updateActiveLink = () => {
    let cur = '';
    sections.forEach(s => { if (window.pageYOffset >= s.offsetTop - 200) cur = s.id; });
    navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#' + cur); });
};
window.addEventListener('scroll', updateActiveLink, { passive: true });

// === Smooth scroll nav ===
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(link.getAttribute('href'));
        if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
});

// === Reveal on scroll ===
const obsOpts = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, obsOpts);
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// === Experience stagger ===
const expObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
            e.target.querySelectorAll('.experience-highlights li').forEach((li, i) => {
                setTimeout(() => { li.style.opacity = '1'; li.style.transform = 'translateX(0)'; }, i * 80);
            });
        }
    });
}, obsOpts);
document.querySelectorAll('.experience-item').forEach(el => expObs.observe(el));

// === Skills stagger ===
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
            e.target.querySelectorAll('.skill-item').forEach((li, i) => {
                setTimeout(() => { li.style.opacity = '1'; li.style.transform = 'translateX(0)'; }, i * 60);
            });
        }
    });
}, obsOpts);
document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));

// === Project card spotlight (mouse-position radial glow via CSS vars) ===
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});

// === Hero canvas — flowing aurora mesh gradient ===
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, time = 0;

    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', resize);
    resize();

    // Orb class — large soft-edged blobs that drift
    class Orb {
        constructor(hue, sat, x, y, radius, vx, vy) {
            this.hue = hue; this.sat = sat;
            this.x = x; this.y = y; this.r = radius;
            this.ox = x; this.oy = y;
            this.vx = vx; this.vy = vy;
        }
        update(t) {
            this.x = this.ox + Math.sin(t * this.vx) * 120 + Math.cos(t * this.vy * 0.7) * 80;
            this.y = this.oy + Math.cos(t * this.vy) * 100 + Math.sin(t * this.vx * 0.5) * 60;
        }
        draw(ctx) {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
            g.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, 60%, 0.12)`);
            g.addColorStop(0.5, `hsla(${this.hue}, ${this.sat}%, 50%, 0.04)`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.fillRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        }
    }

    const orbs = [
        new Orb(250, 70, w * 0.2, h * 0.3, 400, 0.15, 0.12),
        new Orb(220, 60, w * 0.7, h * 0.5, 350, -0.1, 0.18),
        new Orb(280, 50, w * 0.5, h * 0.2, 300, 0.08, -0.14),
        new Orb(200, 65, w * 0.8, h * 0.15, 280, -0.12, 0.09),
    ];

    const animate = () => {
        ctx.clearRect(0, 0, w, h);
        time += 0.003;
        orbs.forEach(o => { o.update(time); o.draw(ctx); });
        requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('resize', () => {
        orbs[0].ox = w * 0.2; orbs[0].oy = h * 0.3;
        orbs[1].ox = w * 0.7; orbs[1].oy = h * 0.5;
        orbs[2].ox = w * 0.5; orbs[2].oy = h * 0.2;
        orbs[3].ox = w * 0.8; orbs[3].oy = h * 0.15;
    });
}

// === Hero parallax ===
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
    if (!heroSection || !heroContent) return;
    const s = window.pageYOffset, hh = heroSection.offsetHeight;
    if (s < hh) {
        heroContent.style.transform = `translateY(${s * 0.3}px)`;
        heroContent.style.opacity = 1 - (s / hh) * 1.1;
    }
}, { passive: true });

// === Stat counter animation ===
const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target.querySelector('.stat-number');
        if (!el || el.dataset.done) return;
        el.dataset.done = '1';
        const txt = el.textContent.trim(), num = parseFloat(txt), sfx = txt.replace(String(num), '');
        if (isNaN(num)) return;
        const start = performance.now(), dur = 1200;
        const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * num) + sfx;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-item').forEach(el => statObs.observe(el));

// === Hero load-in animation ===
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const anim = (sel, delay, ty = 30) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.opacity = '0'; el.style.transform = `translateY(${ty}px)`;
        setTimeout(() => {
            el.style.transition = 'opacity 1s cubic-bezier(0.4,0,0.2,1), transform 1s cubic-bezier(0.4,0,0.2,1)';
            el.style.opacity = '1'; el.style.transform = 'translateY(0)';
        }, delay);
    };
    anim('.hero-title-line', 100, 40);
    anim('.hero-subtitle', 300);
    anim('.hero-location', 400);
    anim('.hero-description', 550);
    anim('.hero-stats', 700);
});

// === Confetti on form success ===
function launchConfetti() {
    const colors = ['#7877c6','#a78bfa','#38bdf8','#f0abfc','#fbbf24','#34d399'];
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        const c = colors[Math.floor(Math.random() * colors.length)], s = 5 + Math.random() * 7;
        p.style.cssText = `left:${30+Math.random()*40}%;bottom:2rem;width:${s}px;height:${s*(0.4+Math.random()*0.6)}px;background:${c};--tx:${(Math.random()-0.5)*300}px;--ty:${-(120+Math.random()*200)}px;--rot:${Math.random()*720}deg;animation-delay:${Math.random()*250}ms;border-radius:${Math.random()>0.5?'50%':'2px'}`;
        document.querySelector('.contact-form-section')?.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
}

// === Contact form ===
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');
if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.querySelector('.submit-text').textContent = 'Sending...';
        formStatus.className = 'form-status';
        try {
            const r = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
            if (r.ok) { formStatus.className = 'form-status success'; formStatus.textContent = '🎉 Message sent!'; contactForm.reset(); launchConfetti(); }
            else { formStatus.className = 'form-status error'; formStatus.textContent = 'Something went wrong. Try again.'; }
        } catch { formStatus.className = 'form-status error'; formStatus.textContent = 'Network error. Check your connection.'; }
        finally { submitBtn.disabled = false; submitBtn.querySelector('.submit-text').textContent = 'Send Message'; }
    });
}

// === Mobile menu ===
const initMobile = () => {
    if (window.innerWidth > 768) return;
    const nc = document.querySelector('.nav-content');
    if (document.querySelector('.mobile-menu-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn'; btn.innerHTML = '☰'; btn.setAttribute('aria-label', 'Menu');
    nc.appendChild(btn);
    btn.addEventListener('click', () => {
        const nl = document.querySelector('.nav-links');
        nl.classList.toggle('mobile-active');
        btn.innerHTML = nl.classList.contains('mobile-active') ? '✕' : '☰';
    });
};
window.addEventListener('load', initMobile);
window.addEventListener('resize', () => { clearTimeout(window._rt); window._rt = setTimeout(initMobile, 200); });
