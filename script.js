// === NAV scroll ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });

// Smooth nav links
document.querySelectorAll('.nav-links a, .hero-ctas a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// === HERO CANVAS — gradient mesh ===
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, t = 0;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', resize); resize();
    const blobs = [
        { h: 268, x: .15, y: .25, r: .45, sx: .08, sy: .06 },
        { h: 238, x: .8,  y: .6,  r: .4,  sx: -.06, sy: .10 },
        { h: 290, x: .5,  y: .1,  r: .35, sx: .04, sy: -.08 },
        { h: 215, x: .9,  y: .2,  r: .28, sx: -.07, sy: .05 },
    ];
    (function draw() {
        ctx.clearRect(0, 0, w, h);
        t += 0.003;
        blobs.forEach(b => {
            const cx = (b.x + Math.sin(t * b.sx) * .14) * w;
            const cy = (b.y + Math.cos(t * b.sy) * .12) * h;
            const r = b.r * Math.min(w, h);
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, `hsla(${b.h},80%,82%,.22)`);
            g.addColorStop(.5, `hsla(${b.h},70%,88%,.06)`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(draw);
    })();
}

// === TYPEWRITER ===
const typeEl = document.getElementById('typewriter');
if (typeEl) {
    const phrases = [
        'Python · Golang · React · Kubernetes',
        'Building developer tools & automation',
        'Full-stack problem solver',
        'Currently at Oracle, Bengaluru'
    ];
    let pi = 0, ci = 0, del = false;
    function typ() {
        const cur = phrases[pi];
        if (!del) {
            typeEl.textContent = cur.slice(0, ++ci);
            if (ci === cur.length) { setTimeout(() => { del = true; typ(); }, 2400); return; }
            setTimeout(typ, 45 + Math.random() * 35);
        } else {
            typeEl.textContent = cur.slice(0, --ci);
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(typ, 500); return; }
            setTimeout(typ, 22);
        }
    }
    setTimeout(typ, 1200);
}

// === LIVE CLOCK (IST) ===
function updateClocks() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const fmt = (n) => String(n).padStart(2, '0');
    const time = `${fmt(now.getHours())}:${fmt(now.getMinutes())}:${fmt(now.getSeconds())} IST`;
    const short = `${fmt(now.getHours())}:${fmt(now.getMinutes())} IST`;
    const el1 = document.getElementById('live-clock');
    const el2 = document.getElementById('nav-clock');
    if (el1) el1.textContent = time;
    if (el2) el2.textContent = short;
}
updateClocks(); setInterval(updateClocks, 1000);

// === STAT COUNTERS ===
const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting || e.target.dataset.done) return;
        e.target.dataset.done = '1';
        const target = parseInt(e.target.dataset.count), start = performance.now();
        (function tick(now) {
            const p = Math.min((now - start) / 1200, 1);
            e.target.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
        })(start);
    });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

// === SPINNING MODAL ===
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalAction = document.getElementById('modal-action');
const modalClose = document.getElementById('modal-close');

function openModal(html, link) {
    modalContent.innerHTML = html;
    if (link) {
        modalAction.href = link;
        modalAction.style.display = 'inline-flex';
    } else {
        modalAction.style.display = 'none';
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
const backdrop = document.getElementById('modal-backdrop');
if (backdrop) backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Experience Trigger
document.querySelectorAll('[data-exp]').forEach(exp => {
    const head = exp.querySelector('.exp-head');
    head.addEventListener('click', () => {
        const role = head.querySelector('.exp-role').innerText;
        const meta = head.querySelector('.exp-meta').innerText;
        const body = exp.querySelector('.exp-body').innerHTML;
        const html = `<h3>${role}</h3><span class="exp-meta">${meta}</span>${body}`;
        openModal(html, null);
    });
});
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(700px) rotateX(${(y - .5) * -6}deg) rotateY(${(x - .5) * 6}deg) translateY(-4px)`;
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// === SCROLL-DRIVEN REVEALS ===
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.exp, .proj-card, .about-col, .contact-left, .c-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1)';
    revealObs.observe(el);
});

// Stagger project cards
document.querySelectorAll('.proj-card').forEach((c, i) => {
    c.style.transitionDelay = (i * .07) + 's';
});

// === ADVANCED SCROLL TRANSFORMS & PARALLAX ===
const heroContent = document.querySelector('.hero-content');
const heroCanvas = document.getElementById('hero-canvas');
const projSection = document.querySelector('.section-dark');
const expInner = document.querySelector('#experience .sec-inner');
const projCards = document.querySelectorAll('.proj-card');

window.addEventListener('scroll', () => {
    const sY = window.scrollY;
    const wH = window.innerHeight;
    
    // 1. Hero Parallax: Scale down, fade, and blur
    if (heroContent && sY < wH) {
        const progress = sY / wH;
        heroContent.style.transform = `translateY(${sY * 0.35}px) scale(${1 - progress * 0.08})`;
        heroContent.style.opacity = 1 - progress * 1.5;
        heroContent.style.filter = `blur(${progress * 8}px)`;
        if (heroCanvas) heroCanvas.style.transform = `translateY(${sY * 0.15}px)`;
    }

    // 2. Expand Projects Section (Fits to width on scroll)
    if (projSection) {
        const rect = projSection.getBoundingClientRect();
        // Progress from 0 (just entering bottom) to 1 (reaches middle)
        let p = (wH - rect.top) / (wH * 0.7);
        p = Math.min(Math.max(p, 0), 1);
        const easeOut = 1 - Math.pow(1 - p, 3);
        
        projSection.style.width = `${88 + (easeOut * 12)}%`;
        projSection.style.margin = '0 auto';
        projSection.style.borderRadius = `${80 - (easeOut * 80)}px`;
    }

    // 3. Experience Section Scale Reveal
    if (expInner) {
        const rect = expInner.getBoundingClientRect();
        let p = (wH - rect.top) / (wH * 0.6);
        p = Math.min(Math.max(p, 0), 1);
        const easeOut = 1 - Math.pow(1 - p, 3);
        
        expInner.style.transform = `scale(${0.9 + (easeOut * 0.1)}) translateY(${40 - (easeOut * 40)}px)`;
        expInner.style.opacity = easeOut;
    }

}, { passive: true });

// Fire scroll once on load to set initial states
window.dispatchEvent(new Event('scroll'));

// === MAGNETIC BUTTONS ===
document.querySelectorAll('.btn-primary, .btn-ghost, .c-link, .exp-head, .proj-card').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        // Skip magnetic effect for big cards to prevent layout jank, only apply to buttons and links
        if(btn.classList.contains('proj-card') || btn.classList.contains('exp-head')) return;
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        if(btn.classList.contains('proj-card') || btn.classList.contains('exp-head')) return;
        btn.style.transform = 'translate(0,0)';
    });
});

// === CONTACT FORM ===
const form = document.getElementById('contact-form');
const btn = document.getElementById('submit-btn');
const status = document.getElementById('form-status');
if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        btn.disabled = true;
        btn.querySelector('.submit-text').textContent = 'Sending...';
        status.className = 'form-status';
        try {
            const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
            if (r.ok) { status.className = 'form-status success'; status.textContent = '🎉 Sent!'; form.reset(); }
            else { status.className = 'form-status error'; status.textContent = 'Failed. Try again.'; }
        } catch { status.className = 'form-status error'; status.textContent = 'Network error.'; }
        finally { btn.disabled = false; btn.querySelector('.submit-text').textContent = 'Send Message'; }
    });
}


