document.addEventListener('DOMContentLoaded', function () {

    const preloader = document.getElementById('preloader');

    window.addEventListener('load', function () {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 2000);
    });


    // Auto-update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Progress Bar — handled by pro-upgrade feature, kept here as fallback
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress && docHeight > 0) {
            scrollProgress.style.width = ((scrollTop / docHeight) * 100) + '%';
        }
    }, { passive: true });

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(2, 12, 27, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrix, 35);

    // Cursor — use the original dot+outline, hide if new trail is active
    const cursorDot = document.querySelector('.cursor-dot:not([style])');
    const cursorOutline = document.querySelector('.cursor-outline');

    let cursorX = 0, cursorY = 0, outlineX = 0, outlineY = 0;

    if (cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX; cursorY = e.clientY;
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
        });
        (function animateCursor() {
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        })();
    }

    const hoverElements = document.querySelectorAll('a, button, .project-card, .cert-card, .edu-card, .skill-tag');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ScrollSpy — IntersectionObserver for pixel-accurate nav highlighting
    const scrollSpy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -75% 0px', threshold: 0 });

    document.querySelectorAll('section[id]').forEach(sec => scrollSpy.observe(sec));

    // Fallback highlightNavLink for scroll event
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop - 120;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + section.offsetHeight) {
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + id) l.classList.add('active');
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNavLink, { passive: true });

    const typingText = document.querySelector('.typing-text');
    const titles = [
        'Cybersecurity Analyst',
        'SOC L1 Analyst',
        'DevOps Engineer',
        'AWS Cloud Engineer',
        'Bug Bounty Hunter',
        'VAPT Specialist',
        'System Engineer',
        'Digital Forensics Expert'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typingText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(typeText, typingSpeed);
    }

    setTimeout(typeText, 2500);

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .counter-number');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');

                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ──────────────────────────────────────────────────────────
       CONTACT FORM — 3-layer delivery (no page reload, no popup)
       Layer 1: Web3Forms API (works everywhere, no confirmation)
       Layer 2: Formsubmit hidden-iframe (no CORS, no redirect)
       ────────────────────────────────────────────────────────── */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {

        // Create the hidden iframe helper ONCE (used by layer 2)
        const iframeHelper = document.createElement('iframe');
        iframeHelper.name = '_jl_mail_target';
        iframeHelper.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;';
        document.body.appendChild(iframeHelper);

        // Helper: fire success/fail UI
        function setBtn(btn, state, origText) {
            const t = btn.querySelector('.btn-text');
            const i = btn.querySelector('.btn-icon');
            if (state === 'loading') {
                t.textContent = 'Sending…';
                i.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                btn.disabled = true; btn.style.background = '';
            } else if (state === 'success') {
                t.textContent = 'Message Sent! ✓';
                i.innerHTML = '<i class="fas fa-check-circle"></i>';
                btn.style.background = 'linear-gradient(135deg,#00ff88,#00cc6a)';
                btn.disabled = true;
                setTimeout(() => {
                    t.textContent = origText;
                    i.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    btn.style.background = ''; btn.disabled = false;
                }, 5000);
            } else {
                t.textContent = origText;
                i.innerHTML = '<i class="fas fa-paper-plane"></i>';
                btn.style.background = ''; btn.disabled = false;
            }
        }

        // Confetti burst on success
        function fireConfetti() {
            if (typeof confetti !== 'undefined') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00ff88', '#00d4ff', '#a855f7', '#ffd700'] });
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
            document.body.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            const particles = Array.from({ length: 120 }, () => ({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 3, d: Math.random() * 60 + 20,
                color: ['#00ff88', '#00d4ff', '#a855f7', '#ffd700', '#ff6b35'][Math.floor(Math.random() * 5)],
                tilt: Math.floor(Math.random() * 10) - 10, tiltAngle: 0, tiltInc: Math.random() * 0.07 + 0.05
            }));
            let frame = 0;
            (function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.tiltAngle += p.tiltInc; p.y += (Math.cos(p.d) + 1); p.x += Math.sin(frame / 40);
                    p.tilt = Math.sin(p.tiltAngle) * 12;
                    ctx.beginPath(); ctx.lineWidth = p.r;
                    ctx.strokeStyle = p.color;
                    ctx.moveTo(p.x + p.tilt + p.r / 2, p.y); ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                    ctx.stroke();
                });
                frame++;
                if (frame < 200) requestAnimationFrame(draw); else canvas.remove();
            })();
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = (document.getElementById('name')?.value || '').trim();
            const email = (document.getElementById('email')?.value || '').trim();
            const subject = (document.getElementById('subject')?.value || '').trim();
            const message = (document.getElementById('message')?.value || '').trim();

            if (!name || !email || !subject || !message) {
                showNotification('⚠️ Please fill in all fields.', 'error'); return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('⚠️ Enter a valid email address.', 'error'); return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const origText = btn.querySelector('.btn-text').textContent;
            setBtn(btn, 'loading', origText);

            let sent = false;

            // ── LAYER 1: Web3Forms (free, no confirmation, works from localhost) ──
            try {
                const fd = new FormData();
                fd.append('access_key', '054bec0d-965f-4ece-b421-7edc0e1ccad5'); // Web3Forms public key
                fd.append('name', name);
                fd.append('email', email);
                fd.append('subject', `[Portfolio] ${subject}`);
                fd.append('message', message);
                fd.append('from_name', 'Portfolio Contact Form');

                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST', body: fd
                });
                const data = await res.json();
                if (data.success) sent = true;
            } catch (_) { /* try next */ }

            // ── LAYER 2: Formsubmit via hidden iframe (no CORS, no page redirect) ──
            if (!sent) {
                try {
                    const hiddenForm = document.createElement('form');
                    hiddenForm.action = 'https://formsubmit.co/jakkalilokesh@gmail.com';
                    hiddenForm.method = 'POST';
                    hiddenForm.target = '_jl_mail_target';
                    hiddenForm.style.display = 'none';
                    [
                        ['name', name], ['email', email], ['message', message],
                        ['_subject', `[Portfolio] ${subject}`],
                        ['_captcha', 'false'], ['_template', 'table'],
                        ['_next', 'about:blank']
                    ].forEach(([k, v]) => {
                        const inp = document.createElement('input');
                        inp.type = 'hidden'; inp.name = k; inp.value = v;
                        hiddenForm.appendChild(inp);
                    });
                    document.body.appendChild(hiddenForm);
                    hiddenForm.submit();
                    setTimeout(() => hiddenForm.remove(), 500);
                    sent = true; // Assume sent (iframe, no response available)
                } catch (_) { /* final fallback below */ }
            }

            if (sent) {
                setBtn(btn, 'success', origText);
                showNotification('✅ Message sent! I\'ll reply within 24 hours.', 'success');
                fireConfetti();
                contactForm.reset();
            } else {
                setBtn(btn, 'reset', origText);
                showNotification('❌ Network error. Email directly: jakkalilokesh@gmail.com', 'error');
            }
        });
    }


    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : 'rgba(100, 255, 218, 0.9)'};
            color: #020c1b;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease forwards;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function initAnimations() {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });

        animateCounters();
    }

    const heroSection = document.querySelector('.hero-section');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (heroSection) {
            heroSection.style.backgroundPositionY = rate + 'px';
        }
    });

    const tiltCards = document.querySelectorAll('.project-card, .cert-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        tag.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.animation = 'glitch-effect 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite';
        });

        element.addEventListener('mouseleave', function () {
            this.style.animation = 'glitch-skew 1s infinite linear alternate-reverse';
        });
    });

    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }

        if (e.key === 'ArrowDown' && e.altKey) {
            e.preventDefault();
            navigateSection(1);
        }

        if (e.key === 'ArrowUp' && e.altKey) {
            e.preventDefault();
            navigateSection(-1);
        }
    });

    function navigateSection(direction) {
        const sectionIds = ['home', 'about', 'experience', 'projects', 'certifications', 'achievements', 'education', 'contact'];
        const currentSection = getCurrentSection();
        const currentIndex = sectionIds.indexOf(currentSection);
        let nextIndex = currentIndex + direction;

        if (nextIndex >= 0 && nextIndex < sectionIds.length) {
            document.querySelector(`#${sectionIds[nextIndex]}`).scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    function getCurrentSection() {
        const sections = ['home', 'about', 'experience', 'projects', 'certifications', 'achievements', 'education', 'contact'];
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && section.offsetTop <= scrollPosition) {
                return sections[i];
            }
        }

        return 'home';
    }

    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));


    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

});

const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes fadeOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease;
    }
`;
document.head.appendChild(additionalStyles);

// ==========================================
// 🔒 FUN ANTI-INSPECT / CONSOLE INTERACTION
// ==========================================

// Clean text-only console
console.clear();

console.log('%c🛡️ JAKKALI LOKESH', 'color: #00ff88; font-size: 24px; font-weight: bold;');
console.log('%cCybersecurity Analyst | SOC Analyst | Bug Bounty Hunter', 'color: #64ffda; font-size: 14px;');
console.log('');
console.log('%c⚠️ WARNING: You have entered a monitored zone!', 'color: #ff4757; font-size: 14px; font-weight: bold;');
console.log('%c📍 Your activity has been logged.', 'color: #ffd700; font-size: 12px;');
console.log('');
// Interactive console hints
console.log('%c🎮 TRY THESE COMMANDS:', 'color: #ffd700; font-size: 14px; font-weight: bold;');
console.log('%c   → hack()    - Watch a hacking simulation', 'color: #8892b0;');
console.log('%c   → skills()  - See my tech stack', 'color: #8892b0;');
console.log('%c   → contact() - Get my contact info', 'color: #8892b0;');
console.log('%c   → matrix()  - Matrix effect', 'color: #8892b0;');
console.log('%c   → devops()   - See my DevOps/Cloud stack', 'color: #8892b0;');
console.log('');

// ============================================
// Analytics configuration
const _0x4a6b = ['Sk', 'TE', 'X0', 'ZmxhZ3s='];
const _0x3c2d = ['aD', 'Rm', 'Mz', 'NfZmluZF9tZQ=='];

const analyticsConfig = {
    version: '2.1.3',
    tracking: true,
    sessionId: 'c2VjdXJpdHlfaXNfbXlfcGFzc2lvbg==',
    userId: null,
    _internal: {
        debug: false,
        cache: 'SkxfZmxhZ3tZMHVfZjB1bmRfbTNfaDRjazNyfQ=='
    }
};

window.decodeFlag = function (encoded) {
    try {
        const decoded = atob(encoded);
        if (decoded.includes('JL_flag')) {
            console.log('%c🎉 CONGRATULATIONS! You found the flag!', 'color: #00ff88; font-size: 20px; font-weight: bold;');
            console.log('%c' + decoded, 'color: #ffd700; font-size: 16px; background: #0a192f; padding: 10px; border-radius: 5px;');
            console.log('%c🏆 You have proven your hacking skills!', 'color: #64ffda;');
            return decoded;
        }
    } catch (e) {
        console.log('%c❌ Invalid encoding. Keep trying!', 'color: #ff4757;');
    }
    return '🔐 Not quite right...';
};

window.hack = function () {
    console.log('%c', 'padding: 5px;');
    console.log('%c🔓 INITIATING HACK SEQUENCE...', 'color: #ff4757; font-size: 18px; font-weight: bold;');
    console.log('%c[█░░░░░░░░░] 10%', 'color: #00ff88;');
    setTimeout(() => console.log('%c[███░░░░░░░] 30%', 'color: #00ff88;'), 500);
    setTimeout(() => console.log('%c[█████░░░░░] 50%', 'color: #ffd700;'), 1000);
    setTimeout(() => console.log('%c[███████░░░] 70%', 'color: #ffd700;'), 1500);
    setTimeout(() => console.log('%c[█████████░] 90%', 'color: #ff4757;'), 2000);
    setTimeout(() => {
        console.log('%c[██████████] 100%', 'color: #ff4757;');
        console.log('%c', 'padding: 3px;');
        console.log('%c❌ ACCESS DENIED!', 'color: #ff4757; font-size: 24px; font-weight: bold;');
        console.log('%c😂 Nice try! But this system is protected by a Security Analyst!', 'color: #64ffda; font-size: 14px;');
        console.log('%c💼 Want to hire me instead? → jakkalilokesh@gmail.com', 'color: #00ff88; font-size: 12px;');
    }, 2500);
    return '🔐 Hack in progress...';
};

window.skills = function () {
    console.log('%c', 'padding: 5px;');
    console.log('%c🛠️ TECHNICAL ARSENAL:', 'color: #ffd700; font-size: 16px; font-weight: bold;');
    console.log('%c', 'padding: 3px;');
    console.log('%c🔵 BLUE TEAM', 'color: #0088ff; font-weight: bold;');
    console.log('%c   SOC Analysis • Threat Detection • Incident Response • SIEM • Forensics', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c🔴 RED TEAM', 'color: #ff4757; font-weight: bold;');
    console.log('%c   VAPT • Penetration Testing • Bug Bounty • Web App Security', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c🟡 TOOLS', 'color: #ffd700; font-weight: bold;');
    console.log('%c   Splunk • Wazuh • Burp Suite • Wireshark • Nmap • Metasploit', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c🟣 CODE', 'color: #9b59b6; font-weight: bold;');
    console.log('%c   Python • Bash • PowerShell • JavaScript • SQL', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c☁️ DEVOPS & CLOUD', 'color: #00d4ff; font-weight: bold;');
    console.log('%c   AWS (EC2, Lambda, EKS, S3, VPC) • Docker • Kubernetes • Terraform • Ansible • Jenkins', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c🔵 MONITORING', 'color: #00ff88; font-weight: bold;');
    console.log('%c   CloudWatch • Grafana • Prometheus', 'color: #8892b0;');
    return '📊 Skills displayed above!';
};

window.contact = function () {
    console.log('%c', 'padding: 5px;');
    console.log('%c📬 CONTACT INFORMATION:', 'color: #00ff88; font-size: 16px; font-weight: bold;');
    console.log('%c', 'padding: 3px;');
    console.log('%c📧 Email: jakkalilokesh@gmail.com', 'color: #64ffda;');
    console.log('%c🔗 LinkedIn: linkedin.com/in/jakkalilokesh', 'color: #0088ff;');
    console.log('%c🐙 GitHub: github.com/jakkalilokesh', 'color: #8892b0;');
    console.log('%c🎯 TryHackMe: tryhackme.com/p/jakkalilokesh', 'color: #00ff88;');
    console.log('%c', 'padding: 3px;');
    console.log('%c💼 Open to: SOC Analyst, DevOps Engineer, Cloud & Security roles', 'color: #ffd700;');
    return '📞 Reach out anytime!';
};

window.devops = function () {
    console.log('%c', 'padding: 5px;');
    console.log('%c☁️ DEVOPS & CLOUD ARSENAL:', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
    console.log('%c', 'padding: 3px;');
    console.log('%c🔄 CI/CD', 'color: #00ff88; font-weight: bold;');
    console.log('%c   Jenkins • GitHub Actions • Docker • Kubernetes', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c🏗️ IaC', 'color: #ffd700; font-weight: bold;');
    console.log('%c   Terraform • Ansible', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c☁️ CLOUD', 'color: #00d4ff; font-weight: bold;');
    console.log('%c   AWS EC2, EKS, Lambda, S3, VPC, CloudWatch, IAM, DynamoDB', 'color: #8892b0;');
    console.log('%c', 'padding: 2px;');
    console.log('%c📊 MONITORING', 'color: #9b59b6; font-weight: bold;');
    console.log('%c   Grafana • Prometheus • CloudWatch', 'color: #8892b0;');
    return '🚀 DevOps stack displayed!';
};

// Matrix effect in console
window.matrix = function () {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let line = '';
    for (let i = 0; i < 50; i++) {
        line += chars[Math.floor(Math.random() * chars.length)];
    }
    console.log('%c' + line, 'color: #00ff88; font-family: monospace;');
    return '🟢 Matrix activated! Run matrix() again for more!';
};

// Fun messages array
const hackerMessages = [
    ['%c💀 Nice try, hacker! But I built this!', 'color: #ff4757; font-size: 14px; font-weight: bold;'],
    ['%c🔒 All vulnerabilities have been patched... or have they? 🤔', 'color: #ffd700; font-size: 14px; font-weight: bold;'],
    ['%c🕵️ You think you can find my secrets? Good luck!', 'color: #9b59b6; font-size: 14px; font-weight: bold;'],
    ['%c⚡ Welcome to the matrix, Neo!', 'color: #00ff88; font-size: 14px; font-weight: bold;'],
    ['%c🎯 Target acquired: Curious Developer', 'color: #ff4757; font-size: 14px; font-weight: bold;'],
    ['%c🔥 This console is hotter than your laptop right now!', 'color: #ff6b35; font-size: 14px; font-weight: bold;'],
    ['%c🚀 Still snooping around? I respect the hustle!', 'color: #64ffda; font-size: 14px; font-weight: bold;'],
    ['%c☕ Take a break, grab some coffee!', 'color: #8b4513; font-size: 14px; font-weight: bold;'],
    ['%c🎮 Type hack() for a fun surprise!', 'color: #00d4ff; font-size: 14px; font-weight: bold;'],
    ['%c💡 Pro tip: Type skills() to see what I can do!', 'color: #ffd700; font-size: 14px; font-weight: bold;'],
];

// Show one fun console message (no repeating loop)
setTimeout(() => {
    const [msg, style] = hackerMessages[Math.floor(Math.random() * hackerMessages.length)];
    console.log(msg, style);
}, 3000);



// Right-click: allow normal behavior but log fun message
document.addEventListener('contextmenu', function (e) {

    // Show custom alert
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
            border: 2px solid #00ff88;
            border-radius: 15px;
            padding: 30px 40px;
            z-index: 99999;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 136, 0.3);
            animation: popIn 0.3s ease;
        ">
            <div style="font-size: 50px; margin-bottom: 15px;">🔒</div>
            <div style="color: #00ff88; font-family: 'Orbitron', sans-serif; font-size: 18px; margin-bottom: 10px;">
                ACCESS DENIED
            </div>
            <div style="color: #8892b0; font-family: 'Share Tech Mono', monospace; font-size: 14px;">
                Right-click disabled by Security Protocol 🛡️
            </div>
            <div style="color: #64ffda; font-family: 'Share Tech Mono', monospace; font-size: 12px; margin-top: 15px;">
                Nice try though! 😉
            </div>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99998;
        " onclick="this.parentElement.remove()"></div>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => alertDiv.remove(), 2000);
});

// Detect F12, Ctrl+Shift+I, Ctrl+Shift+J
document.addEventListener('keydown', function (e) {
    // F12 - just log, don't block
    if (e.key === 'F12') {
        console.log('%c🎉 You found the shortcut! Welcome to the console! 🤷', 'color: #ffd700; font-size: 14px;');
    }

    // Ctrl+Shift+I or Ctrl+Shift+J - just log, don't block
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
        console.log('%c🕵️ Ctrl+Shift+I detected! Welcome, fellow developer!', 'color: #00ff88; font-size: 14px;');
    }
});

// Console clear protection
const consoleWarn = console.warn;
console.warn = function () {
    consoleWarn.apply(console, arguments);
};

// Add CSS animation for popup
const popupStyle = document.createElement('style');
popupStyle.textContent = `
    @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
`;
document.head.appendChild(popupStyle);

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function (e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiSequence.join('')) {
        console.log('%c🎮 KONAMI CODE ACTIVATED! You\'re a true gamer! 🕹️', 'color: #ff00ff; font-size: 20px; font-weight: bold;');
        document.body.style.animation = 'rainbow 2s linear infinite';

        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

console.log('%c🎯 Hiring? Let\'s connect! → jakkalilokesh@gmail.com', 'color: #00ff88; font-size: 16px; font-weight: bold; background: #0a192f; padding: 10px 20px; border-radius: 5px;');

// Resume dropdown toggle
window.toggleResumeMenu = function (e) {
    e.preventDefault();
    const menu = document.getElementById('resume-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
};
document.addEventListener('click', function (e) {
    if (!e.target.closest('.resume-dropdown')) {
        const menu = document.getElementById('resume-menu');
        if (menu) menu.style.display = 'none';
    }
});

// ═══════════════════════════════════════════════════════════
// FEATURE 1 — Live Digital Clock in Navbar
// ═══════════════════════════════════════════════════════════
(function initLiveClock() {
    const el = document.getElementById('live-clock');
    if (!el) return;
    const tick = () => {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };
    tick(); setInterval(tick, 1000);
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 2 — Scroll Progress Bar
// ═══════════════════════════════════════════════════════════
(function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 3 — 3D Card Tilt on Mouse Move
// ═══════════════════════════════════════════════════════════
(function initCardTilt() {
    const cards = document.querySelectorAll('.project-card, .cert-card, .timeline-content, .achievement-card, .arsenal-category');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const rx = -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 8;
            const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 10;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.025,1.025,1.025)`;
            card.style.boxShadow = `${-ry * 2}px ${rx * 2}px 30px rgba(var(--primary-rgb,0,255,136),0.25)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
            card.style.boxShadow = '';
        });
    });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 4 — Animated Skill Bars
// ═══════════════════════════════════════════════════════════
(function initSkillBars() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            en.target.querySelectorAll('.skill-fill').forEach(fill => {
                const pct = fill.dataset.pct || '0';
                fill.style.width = '0%';
                requestAnimationFrame(() => {
                    fill.style.transition = 'width 1.5s cubic-bezier(0.4,0,0.2,1)';
                    fill.style.width = pct + '%';
                });
            });
            obs.unobserve(en.target);
        });
    }, { threshold: 0.25 });
    document.querySelectorAll('.skills-bars-section').forEach(el => obs.observe(el));
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 5 — Copy to Clipboard
// ═══════════════════════════════════════════════════════════
(function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(el => {
        el.title = 'Click to copy'; el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            navigator.clipboard.writeText(el.dataset.copy).then(() => {
                const orig = el.textContent;
                el.textContent = '✅ Copied!'; el.style.color = 'var(--primary)';
                setTimeout(() => { el.textContent = orig; el.style.color = ''; }, 2000);
                showNotification('Copied to clipboard!', 'success');
            });
        });
    });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 6 — Custom Cursor Trail
// ═══════════════════════════════════════════════════════════
(function initCursorTrail() {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const N = 8; const dots = [];
    for (let i = 0; i < N; i++) {
        const d = document.createElement('div');
        const s = (10 - i);
        d.style.cssText = `position:fixed;width:${s}px;height:${s}px;border-radius:50%;pointer-events:none;z-index:99999;background:rgba(0,255,136,${0.7 - i * 0.07});opacity:0;transform:translate(-50%,-50%);`;
        document.body.appendChild(d);
        dots.push({ el: d, x: 0, y: 0 });
    }
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
        let px = mx, py = my;
        dots.forEach((dot, i) => {
            const lag = 0.55 - i * 0.05;
            dot.x += (px - dot.x) * lag;
            dot.y += (py - dot.y) * lag;
            dot.el.style.left = dot.x + 'px';
            dot.el.style.top = dot.y + 'px';
            dot.el.style.opacity = '1';
            px = dot.x; py = dot.y;
        });
        requestAnimationFrame(loop);
    })();
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 7 — Magnetic Buttons
// ═══════════════════════════════════════════════════════════
(function initMagneticBtns() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .filter-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) * 0.3;
            const dy = (e.clientY - r.top - r.height / 2) * 0.3;
            btn.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 8 — Theme Accent Color Switcher
// ═══════════════════════════════════════════════════════════
(function initThemeSwitcher() {
    const sw = document.getElementById('theme-switcher');
    if (!sw) return;
    const themes = [
        { name: 'Matrix Green', p: '#00ff88', s: '#64ffda', rgb: '0,255,136' },
        { name: 'Cyber Blue', p: '#00d4ff', s: '#7dd3fc', rgb: '0,212,255' },
        { name: 'Neon Purple', p: '#a855f7', s: '#c084fc', rgb: '168,85,247' },
        { name: 'Solar Orange', p: '#ff6b35', s: '#ff9a5c', rgb: '255,107,53' },
        { name: 'Hot Pink', p: '#ff007f', s: '#ff5aaa', rgb: '255,0,127' },
    ];
    let idx = parseInt(localStorage.getItem('jl_accent') || '0');
    const apply = i => {
        const t = themes[i];
        const r = document.documentElement;
        r.style.setProperty('--primary', t.p);
        r.style.setProperty('--secondary', t.s);
        r.style.setProperty('--primary-rgb', t.rgb);
        sw.style.background = t.p;
        sw.title = `Theme: ${t.name}`;
        localStorage.setItem('jl_accent', i);
    };
    apply(idx);
    sw.addEventListener('click', () => { idx = (idx + 1) % themes.length; apply(idx); showNotification('🎨 Theme: ' + themes[idx].name, 'success'); });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 9 — Floating Tech Icons in Hero
// ═══════════════════════════════════════════════════════════
(function initHeroParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    const icons = ['⚙️', '🐳', '☁️', '🔐', '🛡️', '🐧', '🔗', '📡', '🌐', '🔒', '⚡', '🚀'];
    icons.forEach((ic, i) => {
        const d = document.createElement('div');
        d.className = 'hero-float-icon';
        d.textContent = ic;
        d.style.cssText = `position:absolute;font-size:${18 + Math.random() * 18}px;left:${5 + Math.random() * 88}%;top:${8 + Math.random() * 76}%;opacity:${0.06 + Math.random() * 0.1};animation:floatIcon ${7 + Math.random() * 7}s ease-in-out infinite ${Math.random() * 5}s;pointer-events:none;user-select:none;z-index:0;filter:blur(0.4px);`;
        hero.appendChild(d);
    });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 10 — Open to Work Banner Dismiss
// ═══════════════════════════════════════════════════════════
(function initBanner() {
    const btn = document.getElementById('banner-close');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const banner = document.getElementById('otw-banner');
        if (banner) { banner.style.opacity = '0'; banner.style.transform = 'translateY(-100%)'; setTimeout(() => banner.remove(), 400); }
    });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 11 — Typing cursor blink on hero
// ═══════════════════════════════════════════════════════════
(function patchShowNotification() {
    // Patch showNotification to handle 'error' type with red color
    const _orig = window.showNotification;
    window.showNotification = function (message, type = 'info') {
        if (type === 'error') {
            const n = document.createElement('div');
            n.style.cssText = `position:fixed;top:100px;right:30px;background:rgba(255,71,87,0.95);color:#fff;padding:15px 25px;border-radius:10px;z-index:99999;display:flex;align-items:center;gap:10px;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:600;box-shadow:0 5px 30px rgba(255,71,87,0.5);animation:slideInRight 0.4s ease;`;
            n.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
            document.body.appendChild(n);
            setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.remove(), 400); }, 5000);
        } else {
            _orig && _orig(message, type);
        }
    };
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 12 — QR Modal (share portfolio)
// ═══════════════════════════════════════════════════════════
(function initQRModal() {
    const modal = document.getElementById('qr-modal');
    const closeBtn = document.getElementById('qr-modal-close');
    const urlEl = document.getElementById('qr-url');
    const shareBtn = document.getElementById('qr-share-btn');
    if (!modal) return;

    const portfolioURL = 'https://jakkalilokesh.github.io/my_portfolio/';

    // Close handlers
    closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });

    // Copy URL on click
    urlEl?.addEventListener('click', () => {
        navigator.clipboard.writeText(portfolioURL).then(() => {
            const orig = urlEl.textContent;
            urlEl.textContent = '✅ Copied!'; urlEl.style.color = '#00ff88';
            setTimeout(() => { urlEl.textContent = orig; urlEl.style.color = ''; }, 2000);
        });
    });

    // Web Share API or fallback
    shareBtn?.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Jakkali Lokesh — Portfolio', text: '🚀 Check out my Cybersecurity & DevOps portfolio!', url: portfolioURL });
            } catch (e) { /* user cancelled */ }
        } else {
            navigator.clipboard.writeText(portfolioURL);
            showNotification('🔗 Portfolio link copied to clipboard!', 'success');
        }
    });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 13 — Live Visitor Counter (countapi.xyz)
// ═══════════════════════════════════════════════════════════
(function initVisitorCounter() {
    const el = document.getElementById('visitor-count');
    if (!el) return;
    fetch('https://api.countapi.xyz/hit/jakkalilokesh.portfolio/visits')
        .then(r => r.json())
        .then(d => {
            if (d && d.value) {
                let count = 0;
                const target = d.value;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    count += step;
                    if (count >= target) { count = target; clearInterval(timer); }
                    el.textContent = count.toLocaleString('en-IN');
                }, 40);
            }
        })
        .catch(() => { el.textContent = '1K+'; });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 14 — Section-level Reading Progress Ring
// ═══════════════════════════════════════════════════════════
(function initReadingRing() {
    const ring = document.createElement('div');
    ring.id = 'reading-ring';
    ring.style.cssText = 'position:fixed;bottom:70px;right:20px;width:40px;height:40px;z-index:9990;pointer-events:none;';
    ring.innerHTML = `<svg viewBox="0 0 36 36" style="transform:rotate(-90deg);width:40px;height:40px;">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="2"/>
        <circle id="reading-ring-fill" cx="18" cy="18" r="15.9" fill="none" stroke="#00ff88"
            stroke-width="2.5" stroke-dasharray="0 100" stroke-linecap="round"
            style="transition:stroke-dasharray 0.2s ease;filter:drop-shadow(0 0 4px #00ff88);"/>
    </svg>`;
    document.body.appendChild(ring);
    const fill = document.getElementById('reading-ring-fill');
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (fill) fill.setAttribute('stroke-dasharray', `${Math.min(pct, 100).toFixed(1)} 100`);
    }, { passive: true });
})();

// ═══════════════════════════════════════════════════════════
// FEATURE 15 — Easter Egg: Konami Code → matrix rain burst
// ═══════════════════════════════════════════════════════════
(function initKonami() {
    const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let pos = 0;
    document.addEventListener('keydown', e => {
        pos = (e.keyCode === code[pos]) ? pos + 1 : 0;
        if (pos === code.length) {
            pos = 0;
            showNotification('🎮 KONAMI CODE! Matrix Mode Activated!', 'success');
            document.body.style.filter = 'hue-rotate(90deg) contrast(1.2)';
            setTimeout(() => { document.body.style.filter = ''; }, 3000);
        }
    });
})();

// ═══════════════════════════════════════════════════════════
// SERVICE WORKER — PWA Registration
// ═══════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/my_portfolio/sw.js')
            .then((reg) => {
                console.log('[SW] Registered, scope:', reg.scope);
            })
            .catch((err) => {
                // Try root path for local development
                navigator.serviceWorker.register('/sw.js')
                    .then((reg) => console.log('[SW] Registered (local):', reg.scope))
                    .catch(() => {}); // Silent fail if no SW support
            });
    });
}