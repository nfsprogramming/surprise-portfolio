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

        // Fallback for local testing
        return {
            question: localStorage.getItem('surpriseQuestion') || "Ready for a surprise?",
            email: localStorage.getItem('devEmail') || "",
            link: localStorage.getItem('surpriseLink') || "https://www.youtube.com"
        };
    };

    const config = getConfig();

    // Initialize UI
    questionText.innerText = config.question;
    secretAnchor.href = config.link;

    // Functions
    const checkAnswer = () => {
        const userAnswer = answerInput.value.trim();

        if (userAnswer === "") {
            showMessage("Please type something first! 😅", "error");
            return;
        }

        // Send answer to dev if email is provided
        if (config.email && config.email.includes('@')) {
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

        fetch(`https://formspree.io/f/${config.email.split('@')[0]}`, { 
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
            for(let i=0; i<40; i++) {
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

    // Falling Effect System
    const createParticle = (burst = false) => {
        const particles = ['🎁', '✨', '💖', '⭐', '🎈', '🌸'];
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerText = particles[Math.floor(Math.random() * particles.length)];
        
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 3 + 4; // 4-7 seconds
        const size = Math.random() * 20 + 20; // 20-40px
        
        particle.style.left = startX + 'px';
        particle.style.fontSize = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.5;
        
        if (burst) {
            particle.style.top = (Math.random() * 100 - 50) + 'px'; // Randomize top for burst
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's'; // Faster for burst
        }

        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    };

    // Continuous slow falling
    setInterval(() => createParticle(false), 800);

    // Initial load
    questionText.innerText = config.question;
    secretAnchor.href = config.link;
});
