# Portfolio — Jakkali Lokesh

## 🔐 Cybersecurity & DevOps Portfolio

[![Deploy Status](https://github.com/jakkalilokesh/my_portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/jakkalilokesh/my_portfolio/actions)
[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-00ff88?logo=github)](https://jakkalilokesh.github.io/my_portfolio/)

**Live Site:** https://jakkalilokesh.github.io/my_portfolio/

---

## 🚀 About

Professional cybersecurity & DevOps portfolio built with vanilla HTML, CSS, and JavaScript. Features:

- 🛡️ **Cybersecurity** — SOC Analysis, VAPT, Threat Hunting, Blue/Red Teaming
- ⚙️ **DevOps** — Docker, Kubernetes, Terraform, Jenkins CI/CD
- ☁️ **Cloud** — AWS (EC2, Lambda, EKS, S3, VPC, CloudWatch)
- 🏆 **Achievements** — $100 Bug Bounty, 13 Certifications, Top 8% TryHackMe

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌟 3D Glassmorphism UI | Dark neon cybersecurity aesthetic |
| 📱 Fully Responsive | Mobile-first across all screen sizes |
| 📧 Contact Form | Web3Forms API with 3-layer delivery |
| 📄 Multi-role Resume | SOC / DevOps / System Engineer downloads |
| 🔢 Live Visitor Counter | Real-time site visitor tracking |
| 🖥️ Typing Animation | Dynamic role typing effect |
| 🌐 PWA Ready | Installable, offline support |
| 🚀 CI/CD | Auto-deploy to GitHub Pages via Actions |
| 🎮 Easter Egg | Konami Code Matrix mode |
| 📊 GitHub Stats | Live contribution tracking |

---

## 📁 Project Structure

```
my_portfolio/
├── index.html          # Main HTML file
├── main.css            # All styles (merged, single file)
├── script.js           # All JavaScript functionality
├── manifest.json       # PWA manifest
├── robots.txt          # SEO robots file
├── sitemap.xml         # SEO sitemap
├── offline.html        # PWA offline fallback
├── favicon.png         # Site icon
├── profile.png         # Profile photo
├── *.pdf               # Role-specific resumes
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions CI/CD
```

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Animations:** AOS (Animate On Scroll), CSS keyframes
- **Icons:** Font Awesome 6
- **Fonts:** Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
- **Email:** Web3Forms API
- **Deployment:** GitHub Pages + GitHub Actions
- **PWA:** Service Worker, Web App Manifest

---

## 📦 Setup & Run Locally

```bash
# Clone the repo
git clone https://github.com/jakkalilokesh/my_portfolio.git
cd my_portfolio

# Install dev server (one-time)
npm install -g serve

# Start local server
serve . -p 3000

# Open in browser
# http://localhost:3000
```

---

## 📧 Contact Form Setup

1. Go to [web3forms.com](https://web3forms.com) and get a free access key
2. In `script.js`, replace the access key on the form submission section
3. Messages will be delivered directly to your Gmail

---

## 🚀 Deploy to GitHub Pages

Push to `main` branch — GitHub Actions will auto-deploy:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

---

## 📄 License

MIT © 2024 Jakkali Lokesh
