// ===== Scroll reveal =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.toggle('active', entry.isIntersecting);
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ===== Active nav link =====
const sections = document.querySelectorAll('#home, #about, #portfolio, #contact');
const navLinks = document.querySelectorAll('.nav-bar a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === `#${entry.target.id}`
                );
            });
        }
    });
}, {
    threshold: 0,
    rootMargin: '-45% 0px -55% 0px' // active section = the one crossing the middle of the screen
});

sections.forEach(section => navObserver.observe(section));


// ===== Hero buttons =====
document.querySelector('.primary-btn').addEventListener('click', () => {
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.secondary-btn').addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});


// ===== Portfolio modals =====
const videoModal = document.querySelector('.video-modal');
const modalVideo = document.querySelector('.modal-video');
const closeVideo = document.querySelector('.close');

function closeVideoModal() {
    videoModal.style.display = 'none';
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
}

document.querySelectorAll('.click-video').forEach(video => {
    video.addEventListener('click', () => {
        modalVideo.src = video.querySelector('source').src;
        videoModal.style.display = 'flex';
        modalVideo.play();
    });
});

closeVideo.addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', e => {
    if (e.target === videoModal) closeVideoModal();
});

const imageModal = document.querySelector('.image-modal');
const imageContainer = document.querySelector('.image-container');
const closeImage = document.querySelector('.close-img');

function closeImageModal() {
    imageModal.style.display = 'none';
    imageContainer.innerHTML = '';
}

document.querySelectorAll('.branding-img, .web-thumbnail').forEach(image => {
    image.addEventListener('click', () => {
        imageContainer.innerHTML = '';

        image.dataset.images
            .split(',')
            .map(src => src.trim())
            .filter(src => src.length > 0)
            .forEach(src => {
                const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
                const el = document.createElement(isVideo ? 'video' : 'img');
                el.src = src;

                if (isVideo) {
                    el.muted = true;
                    el.autoplay = true;
                    el.loop = true;
                    el.controls = true;
                    el.playsInline = true;
                } else {
                    el.alt = image.alt;
                }

                imageContainer.appendChild(el);
            });

        imageModal.style.display = 'flex';
        imageContainer.scrollTop = 0;
    });
});

closeImage.addEventListener('click', closeImageModal);
imageModal.addEventListener('click', e => {
    if (e.target === imageModal) closeImageModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeVideoModal();
        closeImageModal();
    }
});


// ===== Web development "View Gallery" buttons =====
document.querySelectorAll('.web-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.web-project-card').querySelector('.web-thumbnail').click();
    });
});

// ===== Contact form =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = 'Thank you! Your message has been sent.';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
            formStatus.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}