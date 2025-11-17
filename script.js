(function () {
    // Cache DOM nodes
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('.header');
    const ctaButton = document.querySelector('.cta-button');
    const cards = document.querySelectorAll('.step-card, .feature-card');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const overlay = document.querySelector('.image-overlay');

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    // Close mobile menu when clicking a nav link
    if (navMenu && navLinks.length) {
        navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));
    }

    // Smooth scrolling (delegate to anchors with hashes)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Card reveal with IntersectionObserver
    if (cards.length) {
        const obsOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, obsOptions);

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Unified scroll handler (header shadow, nav active link, parallax)
    let ticking = false;
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Header shadow
        if (header) {
            header.style.boxShadow = scrollY > 10 ? '0 2px 10px rgba(0, 0, 0, 0.08)' : 'none';
        }

        // Parallax for overlay (only on larger screens)
        if (overlay && window.innerWidth > 768) {
            overlay.style.transform = `translateY(${(scrollY * 0.3).toFixed(2)}px)`;
        }

        // Active nav link based on sections
        if (navLinks.length && sections.length) {
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop;
                if (scrollY >= top - 200) current = section.id || current;
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // CTA click (kept simple)
    // NOTE: only show the demo alert for a plain <button> CTA without an href.
    // If the CTA is an anchor with an href (navigation), do not intercept the click so navigation proceeds.
    if (ctaButton) {
        try {
            const tag = (ctaButton.tagName || '').toUpperCase();
            const hasHref = !!ctaButton.getAttribute && !!ctaButton.getAttribute('href');
            if (tag === 'BUTTON' && !hasHref) {
                ctaButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Thank you for your interest! We will contact you soon.');
                });
            }
            // anchors with href will navigate normally; no interception
        } catch (err) {
            // If anything goes wrong, don't block navigation
            console.warn('CTA handler initialization failed', err);
        }
    }

    // Initial animations on load
    document.addEventListener('DOMContentLoaded', () => {
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 200);
        }
        if (heroImage) {
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateX(30px)';
            heroImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateX(0)';
            }, 400);
        }
        // Run onScroll once to set initial header/nav states
        onScroll();
    });

    // Click outside to close mobile menu (guarded)
    document.addEventListener('click', (e) => {
        if (!navMenu || !mobileToggle) return;
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
})();

/* Image comparison slider (with auto-play animation) */
(function () {
    const slides = [
        // Lungs (index 0)
        { before: 'Images/before/Lungs.jpg', after: 'Images/after/Lungs.jpg', caption: 'Lungs: AI-Powered Denoising' },
        
        // Spine (index 1)
        { before: 'Images/before/Spine.png', after: 'Images/after/spine.png', caption: 'Spine: Enhanced Clarity' },
        
        // Abdomen (index 2)
        { before: 'Images/before/Abdomen.jpg', after: 'Images/after/abdomen.jpg', caption: 'Abdomen: Superior Visualization' },
        
        // Heart (index 3)
        { before: 'Images/before/Heart.jpg', after: 'Images/after/heart.jpg', caption: 'Heart: Cardiac CT Enhancement' },
        
        // Lungs Ultra-Low (index 4)
        { before: 'Images/before/Lungs Ultra.jpg', after: 'Images/after/Lungs Ultra.jpg', caption: 'Lungs: Ultra-Low Dose Imaging' },
        
        // Brain (index 5)
        { before: 'Images/before/Brain.jpg', after: 'Images/after/Brain.jpg', caption: 'Brain: Neural Structure Visualization' }
    ];
    
    const organDescriptions = {
        0: "<span class='highlight-word'>CTech's</span> advanced AI technology dramatically reduces noise in lung CT scans, enabling ultra-low dose imaging without compromising diagnostic quality. Perfect for frequent monitoring and pediatric patients.",
        4: "<span class='highlight-word'>Our</span> ultra-low dose lung scanning capability achieves up to 76% noise reduction, making it ideal for screening programs and reducing cumulative radiation exposure in high-risk patients.",
        1: "<span class='highlight-word'>Spine</span> imaging benefits from CTech's precision noise reduction, providing exceptional clarity of vertebral structures and soft tissues while maintaining anatomical detail crucial for diagnosis.",
        2: "<span class='highlight-word'>Abdominal</span> CT scans processed by CTech deliver superior visualization of organs, vessels, and pathologies with significantly reduced radiation dose—ideal for routine examinations and follow-ups.",
        3: "<span class='highlight-word'>Heart</span> imaging requires exceptional temporal and spatial resolution. CTech enhances cardiac CT quality while reducing noise by over 55%, enabling better assessment of coronary arteries and cardiac function.",
        5: "<span class='highlight-word'>Brain</span> CT scans processed with CTech technology provide crystal-clear visualization of neural structures, enabling confident diagnosis with reduced radiation exposure—critical for pediatric and repeat imaging."
    };

    let currentSlideIndex = 0;
    let isDragging = false;

    const container = document.getElementById('comparison-container');
    const beforeWrapper = document.getElementById('before-wrapper');
    const beforeImage = document.getElementById('before-image');
    const afterImage = document.getElementById('after-image');
    const handleWrapper = document.getElementById('slider-handle-wrapper');

    const captionText = document.getElementById('caption-text');

    const partButtons = document.querySelectorAll('.part');
    const descriptionElement = document.getElementById('part-description');

    function updateDescription(index) {
        if (descriptionElement && organDescriptions[index]) {
            descriptionElement.querySelector('p').innerHTML = organDescriptions[index];
        }
    }

    function updateSliderPosition(percent) {
        const clamped = Math.max(0, Math.min(100, percent));
        if (beforeWrapper) beforeWrapper.style.width = clamped + '%';
        if (handleWrapper) handleWrapper.style.left = clamped + '%';
        
        // Set before-image to always be full container width
        if (beforeImage && container) {
            const containerWidth = container.clientWidth;
            beforeImage.style.width = containerWidth + 'px';
        }
    }

    function loadSlide(index) {
        if (!Array.isArray(slides) || index < 0 || index >= slides.length) return;
        currentSlideIndex = index;
        const s = slides[index];
        
        if (beforeImage) beforeImage.src = s.before;
        if (afterImage) afterImage.src = s.after;
        
        if (captionText) captionText.textContent = s.caption || '';
        
        // Wait for images to load before updating position
        if (beforeImage) {
            beforeImage.onload = function() {
                updateSliderPosition(50);
            };
        } else {
            updateSliderPosition(50);
        }
        
        // Update active button
        partButtons.forEach(btn => {
            const btnPart = Number(btn.dataset.part);
            btn.classList.toggle('active', btnPart === index);
        });
        
        // Update description
        updateDescription(index);
    }

    function calcPercentFromClientX(clientX) {
        if (!container) return 50;
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        return (x / rect.width) * 100;
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        const pct = calcPercentFromClientX(e.clientX);
        updateSliderPosition(pct);
    }

    function onPointerDown(e) {
        pauseAutoPlay(true);
        isDragging = true;
        if (handleWrapper && handleWrapper.setPointerCapture) {
            handleWrapper.setPointerCapture(e.pointerId);
        }
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        e.preventDefault();
    }

    function onPointerUp(e) {
        isDragging = false;
        try { 
            if (handleWrapper && handleWrapper.releasePointerCapture) {
                handleWrapper.releasePointerCapture(e.pointerId);
            }
        } catch (err) {}
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    }

    let autoPlayInterval;
    let autoPlayPaused = false;
    let manualTriggered = false;

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (manualTriggered) return;
        
        let direction = 1;
        let currentPercent = 50;
        const step = 1;
        const intervalMs = 50;
        let pauseCounter = 0;
        const pauseAt100Frames = 60;

        autoPlayInterval = setInterval(() => {
            if (!autoPlayPaused) {
                if (pauseCounter > 0) {
                    pauseCounter--;
                    return;
                }
                
                currentPercent += direction * step;
                
                if (currentPercent >= 100) {
                    currentPercent = 100;
                    updateSliderPosition(currentPercent);
                    pauseCounter = pauseAt100Frames;
                    direction = -1;
                } else if (currentPercent <= 0) {
                    currentPercent = 0;
                    updateSliderPosition(currentPercent);
                    direction = 1;
                } else {
                    updateSliderPosition(currentPercent);
                }
            }
        }, intervalMs);
    }

    function pauseAutoPlay(isManual = false) {
        autoPlayPaused = true;
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (isManual) {
            manualTriggered = true;
        } else {
            setTimeout(() => {
                autoPlayPaused = false;
                startAutoPlay();
            }, 3000);
        }
    }

    if (container) {
        container.addEventListener('click', (e) => {
            if (handleWrapper && (e.target === handleWrapper || handleWrapper.contains(e.target))) return;
            pauseAutoPlay(true);
            const pct = calcPercentFromClientX(e.clientX);
            updateSliderPosition(pct);
        });
    }

    if (handleWrapper) {
        handleWrapper.addEventListener('pointerdown', onPointerDown);
    }

    partButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            pauseAutoPlay(true);
            const idx = Number(btn.dataset.part);
            if (!Number.isNaN(idx)) loadSlide(idx);
        });
    });

    window.addEventListener('resize', () => {
        const left = (handleWrapper && handleWrapper.style.left) ? handleWrapper.style.left : '50%';
        const percent = typeof left === 'string' && left.endsWith('%') ? parseFloat(left) : 50;
        updateSliderPosition(percent);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadSlide(0);
            startAutoPlay();
        });
    } else {
        loadSlide(0);
        startAutoPlay();
    }
})();
