// main.js - Logic for Surprise Page

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const questionText = document.getElementById('questionText');
    const answerInput = document.getElementById('answerInput');
    const unlockBtn = document.getElementById('unlockBtn');
    const message = document.getElementById('message');
    const questionArea = document.getElementById('questionArea');
    const linkArea = document.getElementById('linkArea');
    const secretAnchor = document.getElementById('secretAnchor');
    const resetBtn = document.getElementById('resetBtn');

    // Load configuration from URL or fallback to localStorage
    const getConfig = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('s');

        if (encodedData) {
            try {
                const decoded = JSON.parse(atob(encodedData));
                return {
                    question: decoded.q,
                    email: decoded.e,
                    link: decoded.l
                };
            } catch (e) {
                console.error("Invalid surprise link data", e);
            }
        }

        // Default public template for general visitors
        return {
            question: "Welcome! Would you like to create a custom surprise link for a friend?",
            email: "",
            link: "admin.html",
            isDefault: true
        };
    };

    const config = getConfig();

    // Initialize UI
    questionText.innerText = config.question;
    secretAnchor.href = config.link;
    if (config.isDefault) {
        secretAnchor.innerHTML = "✨ Create Your Surprise Link!";
        secretAnchor.removeAttribute('target');
    }

    // Functions
    const checkAnswer = () => {
        const userAnswer = answerInput.value.trim();

        if (userAnswer === "") {
            showMessage("Please type something first! 😅", "error");
            return;
        }

        // Send answer to dev if Form ID is provided
        if (config.email && config.email.trim() !== "") {
            submitAnswer(userAnswer);
        } else {
            revealSurprise();
        }
    };

    const submitAnswer = (ans) => {
        unlockBtn.disabled = true;
        unlockBtn.innerText = "Revealing...";

        const formData = new FormData();
        formData.append('question', config.question);
        formData.append('answer', ans);

        fetch(`https://formspree.io/f/${config.email.trim()}`, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).finally(() => {
            revealSurprise();
        });
    };

    const revealSurprise = () => {
        questionArea.style.opacity = '0';
        questionArea.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            questionArea.classList.add('hidden');
            linkArea.classList.remove('hidden');
            message.innerText = "";

            // Celebration Burst
            for (let i = 0; i < 40; i++) {
                setTimeout(() => createParticle(true), i * 50);
            }
        }, 300);
    };

    const showMessage = (text, type) => {
        message.innerText = text;
        message.className = `message ${type}`;

        if (type === 'error') {
            document.getElementById('surpriseCard').animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 200, iterations: 2 });
        }
    };

    const resetPage = () => {
        linkArea.classList.add('hidden');
        questionArea.classList.remove('hidden');
        questionArea.style.opacity = '1';
        questionArea.style.transform = 'translateY(0)';
        answerInput.value = "";
        message.innerText = "";
        unlockBtn.disabled = false;
        unlockBtn.innerText = "Unlock Surprise";
    };

    // Event Listeners
    unlockBtn.addEventListener('click', checkAnswer);

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    resetBtn.addEventListener('click', resetPage);

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

        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    };

    // Continuous slow background falling
    setInterval(() => createParticle(false), 200);

    // Initial message
    showMessage("Accessing NFS interface...", "success");

});
