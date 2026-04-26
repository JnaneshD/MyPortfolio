// ============================================
// 1. LENIS — Buttery Smooth Scroll
// ============================================
const lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true, smoothTouch: false });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ============================================
// 2. PRELOADER — Cinematic Entrance
// ============================================
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    const tl = gsap.timeline({ onComplete: () => { preloader.classList.add('done'); setTimeout(() => preloader.style.display = 'none', 600); initHeroAnimations(); } });
    tl.to('.preloader-line', { opacity: 1, duration: 0.6, ease: 'power2.out' })
      .to('.preloader-sub', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .to('.preloader-line', { opacity: 0, y: -30, duration: 0.5, ease: 'power3.in', delay: 0.6 })
      .to('.preloader-sub', { opacity: 0, y: -15, duration: 0.3, ease: 'power3.in' }, '-=0.35')
      .to(preloader, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
});

// ============================================
// 3. HERO — Split Text Character Animation
// ============================================
function initHeroAnimations() {
    // Split title into chars
    const titleEl = document.querySelector('[data-split]');
    if (titleEl) {
        const text = titleEl.textContent;
        titleEl.innerHTML = '';
        text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            // Gradient on each char
            span.style.background = 'linear-gradient(135deg, #fff 0%, #c4c4e8 50%, #8b8bc8 100%)';
            span.style.webkitBackgroundClip = 'text';
            span.style.webkitTextFillColor = 'transparent';
            span.style.backgroundClip = 'text';
            titleEl.appendChild(span);
        });
        gsap.to('.hero-title .char', { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out', delay: 0.1 });
    }

    // Stagger hero reveals
    gsap.to('.hero-reveal', { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.6,
        onStart: function() { document.querySelectorAll('.hero-reveal').forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(25px)'; }); }
    });
    // Set initial state for hero-reveal elements
    document.querySelectorAll('.hero-reveal').forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(25px)'; });

    // Stat counter
    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        gsap.to({ val: 0 }, { val: target, duration: 1.6, ease: 'power2.out', delay: 1.2,
            onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
        });
    });
}

// ============================================
// 4. SCROLL PROGRESS BAR
// ============================================
const bar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const pct = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (bar) bar.style.width = pct + '%';
}, { passive: true });

// ============================================
// 5. NAV — Scroll + Active Link
// ============================================
const nav = document.getElementById('main-nav');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.pageYOffset > 80);
    let cur = '';
    sections.forEach(s => { if (window.pageYOffset >= s.offsetTop - 200) cur = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, { passive: true });

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(link.getAttribute('href'));
        if (t) lenis.scrollTo(t, { offset: -80, duration: 1.8 });
    });
});

// ============================================
// 6. GSAP SCROLL ANIMATIONS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// Section title clip-path reveal
document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    if (el.classList.contains('section-title')) {
        ScrollTrigger.create({
            trigger: el, start: 'top 85%',
            onEnter: () => el.classList.add('revealed')
        });
    } else {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            opacity: 0, y: 50, duration: 0.9, ease: 'power3.out'
        });
    }
});

// Experience items — stagger in
document.querySelectorAll('.experience-item').forEach((item, i) => {
    gsap.to(item, {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.05,
        onComplete: () => {
            item.querySelectorAll('.experience-highlights li').forEach((li, j) => {
                gsap.to(li, { opacity: 1, x: 0, duration: 0.4, delay: j * 0.06, ease: 'power2.out' });
            });
        }
    });
    // Set initial li state
    item.querySelectorAll('.experience-highlights li').forEach(li => { gsap.set(li, { opacity: 0, x: -15 }); });
});

// Skill categories
document.querySelectorAll('.skill-category').forEach((cat, i) => {
    gsap.to(cat, {
        scrollTrigger: { trigger: cat, start: 'top 88%' },
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.08
    });
});

// ============================================
// 7. HERO CANVAS — Flowing Gradient Mesh
// ============================================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, t = 0;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', resize); resize();

    const blobs = [
        { hue: 255, x: 0.15, y: 0.25, r: 0.35, sx: 0.12, sy: 0.10 },
        { hue: 225, x: 0.75, y: 0.55, r: 0.30, sx: -0.08, sy: 0.15 },
        { hue: 280, x: 0.50, y: 0.15, r: 0.25, sx: 0.06, sy: -0.11 },
        { hue: 210, x: 0.85, y: 0.20, r: 0.22, sx: -0.10, sy: 0.07 },
    ];

    function drawBlob(b) {
        const cx = (b.x + Math.sin(t * b.sx) * 0.12 + Math.cos(t * b.sy * 0.7) * 0.06) * w;
        const cy = (b.y + Math.cos(t * b.sy) * 0.10 + Math.sin(t * b.sx * 0.5) * 0.05) * h;
        const r = b.r * Math.min(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `hsla(${b.hue}, 70%, 55%, 0.10)`);
        g.addColorStop(0.4, `hsla(${b.hue}, 60%, 45%, 0.04)`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
    }

    (function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.004;
        blobs.forEach(drawBlob);
        requestAnimationFrame(animate);
    })();
}

// ============================================
// 8. HERO PARALLAX
// ============================================
const heroContent = document.querySelector('.hero-content');
const heroSection = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    if (!heroContent || !heroSection) return;
    const s = window.pageYOffset, hh = heroSection.offsetHeight;
    if (s < hh) {
        heroContent.style.transform = `translateY(${s * 0.35}px)`;
        heroContent.style.opacity = 1 - (s / hh) * 1.2;
    }
}, { passive: true });

// ============================================
// 9. HORIZONTAL SCROLL — Projects
// ============================================
const track = document.getElementById('projects-track');
if (track && window.innerWidth > 768) {
    const cards = track.querySelectorAll('.project-card');
    const totalScroll = track.scrollWidth - window.innerWidth + 100;

    gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
            trigger: '.projects',
            start: 'top top',
            end: () => '+=' + totalScroll,
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            anticipatePin: 1,
        }
    });
}

// ============================================
// 10. CARD SPOTLIGHT (mouse glow)
// ============================================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});

// ============================================
// 11. CONTACT FORM + CONFETTI
// ============================================
function launchConfetti() {
    const colors = ['#7c6aef','#a78bfa','#38bdf8','#f0abfc','#fbbf24','#34d399'];
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div'); p.className = 'confetti-piece';
        const s = 5 + Math.random() * 7;
        p.style.cssText = `left:${30+Math.random()*40}%;bottom:2rem;width:${s}px;height:${s*(0.4+Math.random()*0.6)}px;background:${colors[Math.floor(Math.random()*colors.length)]};--tx:${(Math.random()-0.5)*300}px;--ty:${-(120+Math.random()*200)}px;--rot:${Math.random()*720}deg;animation-delay:${Math.random()*200}ms;border-radius:${Math.random()>.5?'50%':'2px'}`;
        document.querySelector('.contact-form-section')?.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
}

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
            else { formStatus.className = 'form-status error'; formStatus.textContent = 'Something went wrong.'; }
        } catch { formStatus.className = 'form-status error'; formStatus.textContent = 'Network error.'; }
        finally { submitBtn.disabled = false; submitBtn.querySelector('.submit-text').textContent = 'Send Message'; }
    });
}

// ============================================
// 12. MOBILE MENU
// ============================================
const initMobile = () => {
    if (window.innerWidth > 768) return;
    if (document.querySelector('.mobile-menu-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn'; btn.innerHTML = '☰'; btn.setAttribute('aria-label', 'Menu');
    document.querySelector('.nav-content').appendChild(btn);
    btn.addEventListener('click', () => {
        const nl = document.querySelector('.nav-links');
        nl.classList.toggle('mobile-active');
        btn.innerHTML = nl.classList.contains('mobile-active') ? '✕' : '☰';
    });
};
window.addEventListener('load', initMobile);
window.addEventListener('resize', () => { clearTimeout(window._rt); window._rt = setTimeout(initMobile, 200); });
