// Configuration
let CONFIG = {
    showreelVideoId: 'FBCdo1rn0sY',
    contactEmail: 'chiaramanenticontact@gmail.com',
    bioPath: '/assets/bio_en.txt',
    audioPath: '/assets/audio/',
    carouselPath: '/assets/images/scoring_carousel/'
};

// Load config from JSON file
async function loadConfig() {
    try {
        const response = await fetch('/config.json');
        const config = await response.json();
        CONFIG.showreelVideoId = config.showreel.videoId;
        CONFIG.contactEmail = config.contact.email;
        return config;
    } catch (error) {
        console.warn('Could not load config.json, using defaults');
        return null;
    }
}

// Scoring carousel video URLs (to be updated later)
let scoringVideos = [
    { thumbnail: 'thumb1.jpg', videoId: 'VIDEO_ID_1' },
    { thumbnail: 'thumb2.jpg', videoId: 'VIDEO_ID_2' },
    { thumbnail: 'thumb3.jpg', videoId: 'VIDEO_ID_3' },
    { thumbnail: 'thumb4.jpg', videoId: 'VIDEO_ID_4' }
];

// Audio files
const audioFiles = [
    { title: 'Track 1', filename: 'track1.mp3' },
    { title: 'Track 2', filename: 'track2.mp3' },
    { title: 'Track 3', filename: 'track3.mp3' }
];

// State
let currentAudioPlaying = null;
let menuOpen = false;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    // Load configuration first
    const config = await loadConfig();
    if (config && config.scoringVideos) {
        scoringVideos = config.scoringVideos;
    }
    
    initScrollEffects();
    initMenu();
    initShowreel();
    initCarousel();
    initAudioPlayer();
    loadBio();
    initContactForm();
    initVideoModal();
});

// Scroll Effects
function initScrollEffects() {
    const nav = document.getElementById('main-nav');
    const menuBtn = document.getElementById('menu-btn');
    const hero = document.getElementById('hero');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        // Show menu button after hero section
        if (scrollY > heroHeight - 100) {
            menuBtn.classList.remove('hidden');
            menuBtn.classList.add('visible');
            nav.classList.remove('visible');
            nav.classList.add('hidden');
        } else {
            menuBtn.classList.remove('visible');
            menuBtn.classList.add('hidden');
            if (scrollY > 100) {
                nav.classList.remove('hidden');
                nav.classList.add('visible');
            }
        }

        // Parallax effect for hero
        if (scrollY < heroHeight) {
            const heroImage = document.querySelector('.hero-image');
            heroImage.style.transform = `translateY(${scrollY * 0.5}px)`;
            heroImage.style.opacity = 1 - (scrollY / heroHeight);
        }

        // Parallax effect for section images
        const parallaxImages = document.querySelectorAll('.parallax-image');
        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const offset = window.innerHeight;
            if (rect.top < offset && rect.bottom > 0) {
                const yPos = (rect.top - offset) * 0.3;
                img.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
            }
        });

        lastScroll = scrollY;
    });
}

// Menu
function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenu = document.getElementById('close-menu');
    const menuLinks = document.querySelectorAll('.overlay-nav a, .main-nav a');

    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        menuOpen = true;
        document.body.style.overflow = 'hidden';
    });

    closeMenu.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        menuOpen = false;
        document.body.style.overflow = 'auto';
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (menuOpen) {
                menuOverlay.classList.remove('active');
                menuOpen = false;
                document.body.style.overflow = 'auto';
            }

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            menuOverlay.classList.remove('active');
            menuOpen = false;
            document.body.style.overflow = 'auto';
        }
    });
}

// Showreel
function initShowreel() {
    const showreelContainer = document.getElementById('showreel-video');
    let showreelLoaded = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !showreelLoaded) {
                loadYouTubeVideo(showreelContainer, CONFIG.showreelVideoId, true);
                showreelLoaded = true;
            }
        });
    }, { threshold: 0.5 });

    observer.observe(showreelContainer);
}

// YouTube Video Loader
function loadYouTubeVideo(container, videoId, autoplay = false) {
    const iframe = document.createElement('iframe');
    const params = autoplay 
        ? '?autoplay=1&mute=1&enablejsapi=1' 
        : '?autoplay=1&enablejsapi=1&rel=0';
    iframe.src = `https://www.youtube.com/embed/${videoId}${params}`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    container.innerHTML = '';
    container.appendChild(iframe);
}

// Carousel
function initCarousel() {
    const carousel = document.getElementById('scoring-carousel');
    if (!carousel) return;
    
    const buildCarouselItems = (items) => {
        carousel.innerHTML = '';
        items.forEach((video, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.innerHTML = `<img src="${CONFIG.carouselPath}${video.thumbnail}" alt="Scoring ${index + 1}">`;
            item.addEventListener('click', () => {
                if (!video.videoId) return;
                openVideoModal(video.videoId);
            });
            item.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                if (!video.videoId) return;
                openVideoModal(video.videoId);
            });
            carousel.appendChild(item);
        });
    };
    
    // Prefer config.json to ensure correct video IDs and ordering
    if (scoringVideos && scoringVideos.length) {
        buildCarouselItems(scoringVideos);
    } else {
        // Fallback: load filenames from API
        fetch('/api/carousel-images')
            .then(res => res.json())
            .then(images => {
                const items = images.map(img => ({
                    thumbnail: img.filename,
                    videoId: img.videoId
                }));
                buildCarouselItems(items);
            })
            .catch(() => {
                // No-op if nothing to load
            });
    }

    // Carousel navigation
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -350, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 350, behavior: 'smooth' });
    });

}

// Video Modal
function initVideoModal() {
    const modal = document.getElementById('video-modal');
    const closeBtn = modal.querySelector('.close-modal');

    closeBtn.addEventListener('click', closeVideoModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

function openVideoModal(videoId) {
    const modal = document.getElementById('video-modal');
    const videoContainer = document.getElementById('modal-video');
    
    loadYouTubeVideo(videoContainer, videoId, false);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoContainer = document.getElementById('modal-video');
    
    modal.classList.remove('active');
    videoContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
}

// Audio Player
function initAudioPlayer() {
    const playerContainer = document.getElementById('audio-player');

    fetch('/api/audio-files')
        .then(res => res.json())
        .then(files => {
            files.forEach(file => createAudioTrack(playerContainer, file));
        })
        .catch(() => {
            // Fallback: use static config
            audioFiles.forEach(file => createAudioTrack(playerContainer, file));
        });
}

function createAudioTrack(container, audioData) {
    const track = document.createElement('div');
    track.className = 'audio-track';

    const title = document.createElement('div');
    title.className = 'audio-title';
    title.textContent = audioData.title;

    const controls = document.createElement('div');
    controls.className = 'audio-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.innerHTML = '▶';

    const waveformContainer = document.createElement('div');
    waveformContainer.className = 'waveform-container';

    const progress = document.createElement('div');
    progress.className = 'waveform-progress';

    const waveform = document.createElement('div');
    waveform.className = 'waveform';

    // Generate waveform bars
    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar';
        const height = Math.random() * 70 + 30;
        bar.style.height = `${height}%`;
        waveform.appendChild(bar);
    }

    waveformContainer.appendChild(progress);
    waveformContainer.appendChild(waveform);

    const audio = new Audio(`${CONFIG.audioPath}${audioData.filename}`);

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (currentAudioPlaying && currentAudioPlaying !== audio) {
                currentAudioPlaying.pause();
                currentAudioPlaying.currentTime = 0;
                const otherBtn = currentAudioPlaying.playButton;
                if (otherBtn) otherBtn.innerHTML = '▶';
            }
            audio.play();
            playBtn.innerHTML = '⏸';
            currentAudioPlaying = audio;
            currentAudioPlaying.playButton = playBtn;
        } else {
            audio.pause();
            playBtn.innerHTML = '▶';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
    });

    audio.addEventListener('ended', () => {
        playBtn.innerHTML = '▶';
        progress.style.width = '0%';
    });

    waveformContainer.addEventListener('click', (e) => {
        const rect = waveformContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        audio.currentTime = audio.duration * percent;
    });

    controls.appendChild(playBtn);
    controls.appendChild(waveformContainer);

    track.appendChild(title);
    track.appendChild(controls);

    container.appendChild(track);
}

// Load Bio
function loadBio() {
    fetch(CONFIG.bioPath)
        .then(res => res.text())
        .then(text => {
            const bioContainer = document.getElementById('bio-text');
            bioContainer.innerHTML = text.split('\n').map(p => `<p>${p}</p>`).join('');
        })
        .catch(err => {
            console.error('Failed to load bio:', err);
            document.getElementById('bio-text').innerHTML = '<p>Bio content coming soon...</p>';
        });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.className = 'form-message success';
                messageDiv.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                form.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            messageDiv.className = 'form-message error';
            messageDiv.textContent = 'Failed to send message. Please try again later.';
        }

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    });
}

// Smooth scroll reveal animations
const observeElements = () => {
    const elements = document.querySelectorAll('.content-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
};

// Call reveal animations
setTimeout(observeElements, 100);
