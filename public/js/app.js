// Configuration
let CONFIG = {
    showreelVideoId: 'vmid3t4YpU0',
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
    { thumbnail: 'thumb4.jpg', videoId: 'VIDEO_ID_4' },
    { thumbnail: 'porte-malheur-2.jpg', videoId: null }
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

// Prevent pinch-to-zoom on iOS/iPad
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
});

document.addEventListener('gestureend', function(e) {
    e.preventDefault();
});

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    // Load configuration first
    const config = await loadConfig();
    if (config && config.scoringVideos) {
        scoringVideos = config.scoringVideos;
    }
    
    initScrollEffects();
    initLogoClick();
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
    const socialIcons = document.getElementById('social-icons');
    const topLogo = document.getElementById('top-logo');
    const topBlurBar = document.getElementById('top-blur-bar');
    const hero = document.getElementById('hero');
    const showreel = document.getElementById('showreel');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const showreelTop = showreel.offsetTop;

        // Hide main nav completely, only show menu button after hero
        nav.classList.remove('visible');
        nav.classList.add('hidden');
        
        if (scrollY >= heroHeight - 100) {
            // Show menu button, logo, social icons, and blur bar after hero section
            menuBtn.classList.remove('hidden');
            menuBtn.classList.add('visible');
            topLogo.classList.remove('hidden');
            topLogo.classList.add('visible');
            socialIcons.classList.remove('hidden');
            socialIcons.classList.add('visible');
            topBlurBar.classList.remove('hidden');
            topBlurBar.classList.add('visible');
        } else {
            // Hide menu button, logo, social icons, and blur bar in hero section
            menuBtn.classList.remove('visible');
            menuBtn.classList.add('hidden');
            topLogo.classList.remove('visible');
            topLogo.classList.add('hidden');
            socialIcons.classList.remove('visible');
            socialIcons.classList.add('hidden');
            topBlurBar.classList.remove('visible');
            topBlurBar.classList.add('hidden');
        }

        lastScroll = scrollY;
    });
}

// Logo Click to Scroll to Top
function initLogoClick() {
    const topLogo = document.getElementById('top-logo');
    
    topLogo.style.cursor = 'pointer';
    
    topLogo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Menu
function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenu = document.getElementById('close-menu');
    const menuLinks = document.querySelectorAll('.overlay-nav a, .main-nav a, .hero-bottom-menu a, .scroll-arrow, .footer-column a[href^="#"]');

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

    // Close menu when clicking outside (like legal notice modal)
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
            menuOpen = false;
            document.body.style.overflow = 'auto';
        }
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
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
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
                loadYouTubeVideo(showreelContainer, CONFIG.showreelVideoId, false);
                showreelLoaded = true;
            }
        });
    }, { threshold: 0.5 });

    observer.observe(showreelContainer);
}

// YouTube Video Loader
function loadYouTubeVideo(container, videoId, muted = false) {
    const iframe = document.createElement('iframe');
    const muteParam = muted ? '&mute=1' : '';
    // No autoplay - user clicks to play (prevents black screen on slow connections)
    const params = `?${muteParam}&enablejsapi=1&rel=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&iv_load_policy=3`;
    iframe.src = `https://www.youtube.com/embed/${videoId}${params}`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.id = 'main-video-' + videoId;
    container.innerHTML = '';
    container.appendChild(iframe);
    
    // Add live mirrored shadow effect with sync
    addVideoShadow(container, videoId, iframe, muted);
}

// Add mirrored shadow effect behind video - LIVE MIRROR with SYNC
function addVideoShadow(container, videoId, mainIframe, muted = false) {
    // Create a second iframe as the live mirror/shadow (blurred, bigger, shows around main)
    const shadowIframe = document.createElement('iframe');
    // Shadow params: NO loop/playlist (prevents mobile autoplay), muted, no controls
    const params = `?mute=1&enablejsapi=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;
    shadowIframe.src = `https://www.youtube.com/embed/${videoId}${params}`;
    shadowIframe.frameBorder = '0';
    shadowIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    shadowIframe.id = 'shadow-video-' + videoId;
    
    shadowIframe.className = 'video-shadow-mirror';
    shadowIframe.style.cssText = `
        position: absolute;
        top: -60px;
        left: -60px;
        width: calc(100% + 120px);
        height: calc(100% + 120px);
        filter: blur(40px) brightness(0.6) saturate(1.3);
        opacity: 0.8;
        z-index: -1;
        border-radius: 20px;
        pointer-events: none;
    `;
    
    // Insert shadow before main video
    container.insertBefore(shadowIframe, container.firstChild);
    
    // Sync videos using YouTube API - works on both desktop and mobile
    setTimeout(() => {
        initVideoSync(mainIframe, shadowIframe);
    }, 1000);
}

// Synchronize main video with shadow video using YouTube iframe API
function initVideoSync(mainIframe, shadowIframe) {
    let mainPlayer, shadowPlayer;
    let isSyncing = false; // Prevent feedback loops
    
    // Load YouTube iframe API if not already loaded
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Wait for API to be ready
    const initPlayers = () => {
        if (!window.YT || !window.YT.Player) {
            setTimeout(initPlayers, 100);
            return;
        }
        
        try {
            mainPlayer = new YT.Player(mainIframe.id, {
                events: {
                    'onStateChange': onMainPlayerStateChange,
                    'onReady': onPlayerReady
                }
            });
            
            shadowPlayer = new YT.Player(shadowIframe.id, {
                events: {
                    'onStateChange': onShadowPlayerStateChange
                }
            });
        } catch (e) {
            console.log('Error initializing players:', e);
        }
    };
    
    function onPlayerReady() {
        // Start syncing - check every 100ms for synchronization (more mobile-friendly than 50ms)
        setInterval(() => {
            if (!isSyncing && mainPlayer && shadowPlayer && mainPlayer.getCurrentTime) {
                try {
                    const mainTime = mainPlayer.getCurrentTime();
                    const shadowTime = shadowPlayer.getCurrentTime();
                    
                    // If difference > 0.3 second, sync
                    if (Math.abs(mainTime - shadowTime) > 0.3) {
                        shadowPlayer.seekTo(mainTime, true);
                    }
                } catch (e) {
                    // Ignore errors
                }
            }
        }, 100);
    }
    
    function onMainPlayerStateChange(event) {
        if (isSyncing) return; // Prevent feedback loop
        isSyncing = true;
        
        try {
            // Playing
            if (event.data === 1) {
                if (shadowPlayer && shadowPlayer.playVideo) {
                    shadowPlayer.playVideo();
                    const currentTime = mainPlayer.getCurrentTime();
                    shadowPlayer.seekTo(currentTime, true);
                }
            }
            // Paused
            else if (event.data === 2) {
                if (shadowPlayer && shadowPlayer.pauseVideo) {
                    shadowPlayer.pauseVideo();
                }
            }
            // Ended
            else if (event.data === 0) {
                if (shadowPlayer && shadowPlayer.pauseVideo) {
                    shadowPlayer.pauseVideo();
                    shadowPlayer.seekTo(0);
                }
            }
        } catch (e) {
            console.log('Main player state change error:', e);
        }
        
        setTimeout(() => { isSyncing = false; }, 200);
    }
    
    function onShadowPlayerStateChange(event) {
        // Shadow should never trigger main player changes
        // Just log for debugging if needed
        // console.log('Shadow state:', event.data);
    }
    
    // Start initialization with longer delay for mobile
    setTimeout(initPlayers, 1000);
}

// Carousel
function initCarousel() {
    const carousel = document.getElementById('scoring-carousel');
    if (!carousel) return;
    
    const buildCarouselItems = (items) => {
        carousel.innerHTML = '';
        
        // Create items 3 times for infinite scroll effect
        const tripleItems = [...items, ...items, ...items];
        
        tripleItems.forEach((video, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.innerHTML = `<img src="${CONFIG.carouselPath}${video.thumbnail}" alt="${video.title} - Original Film Score by Chiara Manenti">`;
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
        
        // Start from middle set
        setTimeout(() => {
            carousel.scrollLeft = carousel.scrollWidth / 3;
        }, 100);
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

    // Continuous auto-slide
    let animationFrame;
    let isPaused = false;
    const slideSpeed = 1; // pixels per frame

    function continuousSlide() {
        if (!isPaused) {
            carousel.scrollLeft += slideSpeed;
            
            // Reset to middle when reaching end
            const oneThirdScroll = carousel.scrollWidth / 3;
            const twoThirdScroll = (carousel.scrollWidth / 3) * 2;
            
            if (carousel.scrollLeft >= twoThirdScroll) {
                carousel.scrollLeft = oneThirdScroll;
            }
        }
        animationFrame = requestAnimationFrame(continuousSlide);
    }

    continuousSlide();

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    // Resume on mouse leave
    carousel.addEventListener('mouseleave', () => {
        isPaused = false;
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
    waveform.setAttribute('data-filename', audioData.filename);

    // Generate flat placeholder bars (will animate to real waveform after audio loads)
    for (let i = 0; i < 300; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar';
        bar.style.height = '30%'; // Flat neutral state
        bar.style.opacity = '0.3'; // Dimmed to show it's not loaded
        waveform.appendChild(bar);
    }

    waveformContainer.appendChild(progress);
    waveformContainer.appendChild(waveform);

    // Function to generate real waveform from audio buffer
    function generateRealWaveform(audioBuffer) {
        const rawData = audioBuffer.getChannelData(0); // Get mono channel
        const samples = 300; // Number of bars for SoundCloud-style detail
        const blockSize = Math.floor(rawData.length / samples);
        const bars = waveform.querySelectorAll('.waveform-bar');
        
        for (let i = 0; i < samples; i++) {
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum += Math.abs(rawData[(i * blockSize) + j]);
            }
            const average = sum / blockSize;
            const height = Math.max(10, Math.min(100, average * 300)); // Scale to 10-100%
            
            if (bars[i]) {
                bars[i].style.transition = 'height 0.3s ease-out, opacity 0.3s ease-out';
                bars[i].style.height = `${height}%`;
                bars[i].style.opacity = '1'; // Full opacity when real data loaded
            }
        }
    }

    // Load audio immediately on page load (no lazy loading)
    const audio = new Audio(`${CONFIG.audioPath}${audioData.filename}`);
    let audioLoaded = false;

    // Generate real waveform using Web Audio API
    fetch(`${CONFIG.audioPath}${audioData.filename}`)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return audioContext.decodeAudioData(arrayBuffer);
        })
        .then(audioBuffer => {
            generateRealWaveform(audioBuffer);
        })
        .catch(err => console.log('Waveform generation error:', err));

    // Set up event listeners
    audio.addEventListener('canplaythrough', () => {
        audioLoaded = true;
    }, { once: true });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
    });

    audio.addEventListener('ended', () => {
        playBtn.innerHTML = '▶';
        progress.style.width = '0%';
    });

    // Start loading audio
    audio.load();

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            // Stop other playing audio
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

    waveformContainer.addEventListener('click', (e) => {
        if (!audioLoaded || !audio) return;
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
let turnstileToken = null;

// Callback when Turnstile is completed
window.onTurnstileSuccess = function(token) {
    console.log('Turnstile callback fired! Token:', token);
    turnstileToken = token;
    console.log('Token stored:', turnstileToken);
};

function initContactForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if Turnstile token is available
        if (!turnstileToken) {
            messageDiv.style.display = 'block';
            messageDiv.className = 'form-message error';
            messageDiv.textContent = 'Please complete the verification challenge.';
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            turnstileToken: turnstileToken
        };

        // Debug: Log what we're sending
        console.log('Submitting form data:', formData);
        console.log('Actual token value:', turnstileToken);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.style.display = 'block';
                messageDiv.className = 'form-message success';
                messageDiv.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                form.reset();
                // Reset Turnstile widget and token
                turnstileToken = null;
                if (window.turnstile) {
                    window.turnstile.reset();
                }
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            messageDiv.style.display = 'block';
            messageDiv.className = 'form-message error';
            messageDiv.textContent = 'Failed to send message. Please try again later.';
        }

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    });
}

// Smooth scroll reveal animations - DISABLED
// const observeElements = () => {
//     const elements = document.querySelectorAll('.content-section');
//     
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.style.opacity = '1';
//                 entry.target.style.transform = 'translateY(0)';
//             }
//         });
//     }, { threshold: 0.1 });
// 
//     elements.forEach(el => {
//         el.style.opacity = '0';
//         el.style.transform = 'translateY(30px)';
//         el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
//         observer.observe(el);
//     });
// };

// Mobile Fixed Background Effect (iOS Workaround)
function initMobileFixedBackgrounds() {
    // Run on mobile/tablet devices OR iPad landscape (up to 1400px in landscape)
    const isLandscape = window.innerWidth > window.innerHeight;
    const maxWidth = isLandscape ? 1400 : 1024;
    
    if (window.innerWidth > maxWidth) return;
    
    const backgrounds = document.querySelectorAll('.parallax-image-mobile');
    if (backgrounds.length === 0) return;
    
    let ticking = false;
    
    function updateBackgrounds() {
        const viewportHeight = window.innerHeight;
        
        backgrounds.forEach(bg => {
            const parent = bg.parentElement;
            const rect = parent.getBoundingClientRect();
            
            // Check if parent section is visible in viewport
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Section is visible - show and fix background
                bg.style.position = 'fixed';
                bg.style.top = '0';
                bg.style.left = '0';
                bg.style.width = '100vw';
                bg.style.height = '100vh';
                bg.style.zIndex = '-1';
                bg.style.display = 'block';
            } else {
                // Section not visible - hide background
                bg.style.display = 'none';
            }
        });
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateBackgrounds);
            ticking = true;
        }
    }
    
    // Initial call
    updateBackgrounds();
    
    // Update on scroll (throttled with requestAnimationFrame)
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', () => {
        const isLandscape = window.innerWidth > window.innerHeight;
        const maxWidth = isLandscape ? 1400 : 1024;
        
        if (window.innerWidth > maxWidth) {
            // Switched to desktop - remove inline styles
            backgrounds.forEach(bg => {
                bg.style.cssText = '';
            });
        } else {
            updateBackgrounds();
        }
    });
}

// Call reveal animations - DISABLED
// setTimeout(observeElements, 100);

// Initialize mobile fixed backgrounds
initMobileFixedBackgrounds();

// Legal Modals
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const legalNoticeModal = document.getElementById('legal-notice-modal');
    const privacyPolicyModal = document.getElementById('privacy-policy-modal');
    
    // Get link elements
    const legalNoticeLink = document.getElementById('legal-notice-link');
    const privacyPolicyLink = document.getElementById('privacy-policy-link');
    
    // Get close buttons
    const closeButtons = document.querySelectorAll('.close-legal-modal');
    
    // Open legal notice modal
    legalNoticeLink.addEventListener('click', function(e) {
        e.preventDefault();
        legalNoticeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Open privacy policy modal
    privacyPolicyLink.addEventListener('click', function(e) {
        e.preventDefault();
        privacyPolicyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            legalNoticeModal.classList.remove('active');
            privacyPolicyModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close modal when clicking outside content
    [legalNoticeModal, privacyPolicyModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            legalNoticeModal.classList.remove('active');
            privacyPolicyModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Dynamic copyright year and privacy policy date
(function() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Set copyright year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = currentYear;
    }
    
    // Set privacy policy date (Month Year format)
    const privacyDate = document.getElementById('privacy-date');
    if (privacyDate) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonth = monthNames[currentDate.getMonth()];
        privacyDate.textContent = `${currentMonth} ${currentYear}`;
    }
})();

// Email obfuscation - protects against spam bots
(function() {
    // Obfuscated email (Base64 encoded)
    const obfuscatedEmail = 'Y29udGFjdEBjaGlhcmFtYW5lbnRpLmNvbQ==';
    
    // Decode the email
    function decodeEmail(encoded) {
        return atob(encoded);
    }
    
    // Get all email placeholder elements
    const emailElements = document.querySelectorAll('.obfuscated-email');
    
    // Populate each element with the decoded email
    emailElements.forEach(element => {
        const email = decodeEmail(obfuscatedEmail);
        
        // Create a clickable mailto link
        const link = document.createElement('a');
        link.href = 'mailto:' + email;
        link.textContent = email;
        link.style.color = 'inherit';
        link.style.textDecoration = 'none';
        
        // Add hover effect
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--text-gold)';
            this.style.textDecoration = 'underline';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = 'inherit';
            this.style.textDecoration = 'none';
        });
        
        element.appendChild(link);
    });
})();
