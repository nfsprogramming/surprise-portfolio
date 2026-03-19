// admin.js - Logic for Admin Dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Form Elements
    const adminForm = document.getElementById('adminForm');
    const questionInput = document.getElementById('questionInput');
    const devEmailInput = document.getElementById('devEmailInput');
    const secretLinkInput = document.getElementById('secretLinkInput');
    const adminMessage = document.getElementById('adminMessage');
    const saveBtn = document.getElementById('saveBtn');
    const shareableLinkSection = document.getElementById('shareableLinkSection');
    const shareableLink = document.getElementById('shareableLink');
    const copyBtn = document.getElementById('copyBtn');

    // Load existing settings
    const loadSettings = () => {
        const question = localStorage.getItem('surpriseQuestion');
        const email = localStorage.getItem('devEmail');
        const link = localStorage.getItem('surpriseLink');

        if (question && link) {
            questionInput.value = question;
            devEmailInput.value = email || "";
            secretLinkInput.value = link;
            generateLink(question, email || "", link);
        }
    };

    const generateLink = (q, e, l) => {
        const data = { q, e, l };
        const encoded = btoa(JSON.stringify(data));
        
        // Get the directory containing the current file to support local file preview
        const url = new URL(window.location.href);
        const basePath = url.href.substring(0, url.href.lastIndexOf('/')) + '/';
        const finalUrl = `${basePath}index.html?s=${encoded}`;

        shareableLink.value = finalUrl;
        shareableLinkSection.classList.remove('hidden');
    };

    // Save settings
    const saveSettings = (ev) => {
        ev.preventDefault();

        const question = questionInput.value.trim();
        const email = devEmailInput.value.trim();
        const link = secretLinkInput.value.trim();

        if (!question || !link) {
            showMessage("Please fill in question and link! ⚠️", "error");
            return;
        }

        try {
            localStorage.setItem('surpriseQuestion', question);
            localStorage.setItem('devEmail', email);
            localStorage.setItem('surpriseLink', link);

            generateLink(question, email, link);
            showMessage("Link generated successfully! 🔗", "success");

            // Celebration Burst
            for (let i = 0; i < 30; i++) {
                setTimeout(() => createParticle(true), i * 50);
            }

            saveBtn.innerText = "Updated!";
            saveBtn.style.background = "var(--success-color)";

            setTimeout(() => {
                saveBtn.innerText = "Generate & Save Surprise Link";
                saveBtn.style.background = "";
            }, 2000);

        } catch (error) {
            showMessage("Error saving settings. 😢", "error");
            console.error(error);
        }
    };

    const copyToClipboard = () => {
        shareableLink.select();
        document.execCommand('copy');

        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copied!";
        setTimeout(() => copyBtn.innerText = originalText, 2000);
    };

    const showMessage = (text, type) => {
        adminMessage.innerText = text;
        adminMessage.className = `message ${type}`;

        setTimeout(() => {
            adminMessage.innerText = "";
        }, 3000);
    };

    // Event Listeners
    adminForm.addEventListener('submit', saveSettings);
    copyBtn.addEventListener('click', copyToClipboard);

    // Initial load
    loadSettings();

    // Falling Effect System (Digital Rain for Admin)
    const createParticle = (burst = false) => {
        const particles = ['0', '1', '{', '}', '<', '>', '/', ';', '*', '$', '#', '!'];
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerText = particles[Math.floor(Math.random() * particles.length)];

        const startX = Math.random() * window.innerWidth;
        const duration = burst ? (Math.random() * 2 + 1) : (Math.random() * 5 + 5); 
        const size = burst ? (Math.random() * 15 + 10) : (Math.random() * 12 + 8);

        particle.style.left = startX + 'px';
        particle.style.fontSize = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.opacity = Math.random() * 0.4 + 0.1;

        if (burst) {
            particle.style.top = (Math.random() * 50 + 20) + '%'; 
            particle.style.color = '#fff';
            particle.style.opacity = '1';
            particle.style.filter = 'blur(1px)';
            particle.style.zIndex = '100';
        }

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
    };

    setInterval(() => createParticle(false), 300);
});
