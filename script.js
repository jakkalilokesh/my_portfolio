document.addEventListener('DOMContentLoaded', function () {

    const preloader = document.getElementById('preloader');

    window.addEventListener('load', function () {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 2000);
    });

    // Visitor Counter (localStorage based)
    const visitorCountEl = document.getElementById('visitor-count');
    if (visitorCountEl) {
        let count = localStorage.getItem('jl_visitor_count') || 0;
        count = parseInt(count) + 1;
        localStorage.setItem('jl_visitor_count', count);
        visitorCountEl.textContent = count.toLocaleString();
    }

    // Auto-update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

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

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    let cursorX = 0;
    let cursorY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    });

    function animateCursor() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;

        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

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
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    const typingText = document.querySelector('.typing-text');
    const titles = [
        'Cybersecurity Analyst',
        'SOC L1 Analyst',
        'Bug Bounty Hunter',
        'VAPT Specialist',
        'Digital Forensics Expert',
        'Ethical Hacker'
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
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        const mailtoLink = `mailto:jakkalilokesh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        window.location.href = mailtoLink;

        showNotification('Opening email client...', 'success');
    });

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
        const sectionIds = ['home', 'about', 'experience', 'projects', 'certifications', 'education', 'contact'];
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
        const sections = ['home', 'about', 'experience', 'projects', 'certifications', 'education', 'contact'];
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
    console.log('%c💼 Open to: SOC Analyst, Security Analyst, VAPT roles', 'color: #ffd700;');
    return '📞 Reach out anytime!';
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

// Show random message every 8 seconds in console
setInterval(() => {
    const [msg, style] = hackerMessages[Math.floor(Math.random() * hackerMessages.length)];
    console.log(msg, style);
}, 8000);

// Disable right-click with fun message
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();

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

// Detect F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
document.addEventListener('keydown', function (e) {
    // F12 - just log, don't block
    if (e.key === 'F12') {
        console.log('%c🎉 You found the shortcut! Welcome to the console! 🤷', 'color: #ffd700; font-size: 14px;');
    }

    // Ctrl+Shift+I or Ctrl+Shift+J - just log, don't block
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
        console.log('%c🕵️ Ctrl+Shift+I detected! Welcome, fellow developer!', 'color: #00ff88; font-size: 14px;');
    }

    // Ctrl+U (View Source) - block this one
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        console.log('%c📜 View Source blocked! The code is too beautiful to share... jk it\'s on GitHub! 😂', 'color: #ff4757; font-size: 14px;');
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
