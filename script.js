/**
 * ==========================================================================
 * byDavidStudio | PROFESSIONAL VANILLA JS ENGINE
 * Handles: Preloader, Scroll Acceleration Marquees, 3D Tilt, Magnetic UI,
 * Horizontal Scroll Showcase, Custom Cursor, and FAQ Accordion.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  // --- 1. PRELOADER ---
  const preloader = document.querySelector('.premium-preloader');
  const progressVal = document.querySelector('.preloader-perc');
  const progressBar = document.querySelector('.preloader-bar');
  let perc = 0;

  document.body.classList.add('loading');

  const loaderInterval = setInterval(() => {
    perc += Math.floor(Math.random() * 14) + 8;
    if (perc >= 100) {
      perc = 100;
      clearInterval(loaderInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('done');
        document.body.classList.remove('loading');
      }, 350);
    }
    if (progressVal) progressVal.textContent = (perc < 10 ? '0' : '') + perc + '%';
    if (progressBar) progressBar.style.width = perc + '%';
  }, 75);

  // --- 2. TOP SCROLL PROGRESS BAR ---
  const scrollBar = document.querySelector('.scroll-progress-bar');
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = `${progress}%`;
  };

  // --- 3. NAVBAR SCROLL & MOBILE AUTO-HIDE/SHOW EFFECT ---
  const navbar = document.querySelector('.navbar');
  let prevScrollPos = window.scrollY;

  const updateNavbar = () => {
    if (!navbar) return;
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Smart Hide/Show on Mobile & Tablet
    if (window.innerWidth <= 1024 && !document.body.classList.contains('menu-open')) {
      if (currentScrollPos > prevScrollPos && currentScrollPos > 80) {
        // Scrolling down — hide navbar smoothly
        navbar.classList.add('nav-hidden');
      } else if (prevScrollPos - currentScrollPos > 6 || currentScrollPos <= 40) {
        // Scrolling up — reappear immediately
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }
    prevScrollPos = currentScrollPos;
  };

  // --- 4. CUSTOM CURSOR (DESKTOP ONLY — STRICTLY DISABLED ON MOBILE/TABLET TOUCH) ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const isTouchDevice = isTouch || window.matchMedia("(pointer: coarse)").matches || ('ontouchstart' in window && navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;

  if (isTouchDevice) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  } else if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    document.querySelectorAll('a, button, input, textarea, select, .accordion-head, .magnetic-target').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover-active'));
    });
  }

  // --- 5. TOUCH-SAFE MAGNETIC BUTTONS ---
  if (!isTouch) {
    document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
      const target = wrap.querySelector('.magnetic-target');
      if (!target) return;

      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const relX = (e.clientX - rect.left) - rect.width / 2;
        const relY = (e.clientY - rect.top) - rect.height / 2;
        target.style.transform = `translate(${relX * 0.28}px, ${relY * 0.28}px)`;
      });

      wrap.addEventListener('mouseleave', () => {
        target.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // --- 5.5 INTERACTIVE AMBIENT BACKGROUND SPARKLES & RIft CANVAS ---
  const bgCanvas = document.getElementById('bgInteractiveCanvas');
  if (bgCanvas && !isTouch) {
    const bgCtx = bgCanvas.getContext('2d');
    let width = bgCanvas.width = window.innerWidth;
    let height = bgCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    });

    const particles = [];
    const pCount = 35;
    const colors = ['rgba(220, 56, 38, 0.45)', 'rgba(217, 150, 50, 0.45)', 'rgba(15, 108, 79, 0.45)'];

    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 2 + Math.random() * 4.5,
        color: colors[i % colors.length]
      });
    }

    let mouseTargetX = width / 2;
    let mouseTargetY = height / 2;
    window.addEventListener('mousemove', (e) => {
      mouseTargetX = e.clientX;
      mouseTargetY = e.clientY;
    });

    function animBg() {
      bgCtx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle interactive mouse magnetic attraction/repulsion
        const dx = mouseTargetX - p.x;
        const dy = mouseTargetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          p.x += (dx / dist) * 0.4;
          p.y += (dy / dist) * 0.4;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        bgCtx.fillStyle = p.color;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        bgCtx.fill();
      });

      requestAnimationFrame(animBg);
    }
    requestAnimationFrame(animBg);
  }

  // --- 6. MULTI-LAYER HOLOGRAPHIC 3D TILT ---
  const heroVisual = document.getElementById('heroVisual');
  const holoBorderWrap = document.querySelector('.holo-border-wrap');
  const holoCards = document.querySelectorAll('.holo-card');

  if (!isTouch && heroVisual && holoBorderWrap) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      holoBorderWrap.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
      
      // Floating cards tilt opposite for holographic 3D depth
      holoCards.forEach((card, idx) => {
        const factor = idx === 0 ? -16 : -20;
        card.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 30px) rotateY(${x * -6}deg) rotateX(${-y * -6}deg)`;
      });
    });

    heroVisual.addEventListener('mouseleave', () => {
      holoBorderWrap.style.transform = 'rotateY(0deg) rotateX(0deg)';
      holoCards.forEach(card => {
        card.style.transform = 'translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  // --- 7. CRAZY LIQUID PAINT DRIPPING MOBILE MENU ---
  const menuBtn = document.getElementById('menuToggle');
  const canvas = document.getElementById('drippingCanvas');
  let dripAnimId = null;

  function triggerPaintDripping() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Simulate thick viscous liquid paint pouring and coating down
    const waves = [
      { color: '#dc3826', speed: 18, y: -150, delay: 0 },
      { color: '#d99632', speed: 20, y: -250, delay: 80 },
      { color: '#0f6c4f', speed: 22, y: -350, delay: 160 }
    ];

    const columns = Math.floor(canvas.width / 24);
    const columnOffsets = Array.from({ length: columns }, () => Math.random() * 90 - 45);

    let startTime = performance.now();
    function animateDrips(now) {
      const elapsed = now - startTime;
      if (elapsed > 1350) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      waves.forEach(wave => {
        if (elapsed < wave.delay) return;
        wave.y += wave.speed;

        ctx.fillStyle = wave.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, wave.y);

        for (let i = 0; i < columns; i++) {
          const x = (i / (columns - 1)) * canvas.width;
          const dripY = wave.y + columnOffsets[i] + Math.sin((elapsed + i * 40) * 0.01) * 35;
          ctx.lineTo(x, Math.max(0, dripY));
        }

        ctx.lineTo(canvas.width, 0);
        ctx.closePath();
        ctx.fill();

        // Extra dynamic dripping drops falling below the wave front
        for (let i = 0; i < columns; i += 3) {
          const dropX = (i / (columns - 1)) * canvas.width;
          const dropY = wave.y + columnOffsets[i] + 45 + (elapsed * 0.03 * (i % 5));
          if (dropY > 0 && dropY < canvas.height + 50) {
            ctx.beginPath();
            ctx.arc(dropX, dropY, 7 + (i % 4), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      dripAnimId = requestAnimationFrame(animateDrips);
    }
    if (dripAnimId) cancelAnimationFrame(dripAnimId);
    dripAnimId = requestAnimationFrame(animateDrips);
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      document.body.classList.toggle('no-scroll');
      if (isOpen) triggerPaintDripping();
    });
  }
  document.querySelectorAll('.mega-link').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open', 'no-scroll');
    });
  });

  // --- 8. SCROLL REVEAL OBSERVER ---
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- 9. PROCESS TIMELINE PROGRESS ---
  const processItems = document.querySelectorAll('.step-item');
  const processProgress = document.getElementById('processProgress');
  const updateProcessTimeline = () => {
    if (!processItems.length || !processProgress) return;
    let activeCount = 0;
    processItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.65) {
        item.classList.add('active');
        activeCount++;
      } else {
        item.classList.remove('active');
      }
    });
    const progressPerc = (activeCount / processItems.length) * 100;
    processProgress.style.height = `${progressPerc}%`;
  };

  // --- 10. HORIZONTAL PORTFOLIO SCROLL ENGINE ---
  const horizWrapper = document.querySelector('.portfolio-scroll-wrapper');
  const horizTrack = document.querySelector('.portfolio-horizontal-track');
  const updateHorizontalScroll = () => {
    if (!horizWrapper || !horizTrack) return;
    const rect = horizWrapper.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;
    if (scrollDistance > 0) {
      let progress = 0;
      if (rect.top <= 0) {
        progress = -rect.top / scrollDistance;
      }
      progress = Math.max(0, Math.min(1, progress));
      const maxTranslate = horizTrack.scrollWidth - window.innerWidth;
      horizTrack.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
    }
  };

  // --- 11. SILKY SMOOTH MARQUEE ENGINE (SCROLL ACCELERATED) ---
  // Calculates real frame delta (dt) and boosts velocity based on scroll delta
  const marquees = [
    { el: document.getElementById('marqTrack1'), offset: 0, speed: 50, currentSpeed: 50, boost: 0, dir: 1 },
    { el: document.getElementById('marqTrack2'), offset: 0, speed: 38, currentSpeed: 38, boost: 0, dir: -1 }
  ];

  let lastScrollY = window.scrollY;
  let lastTime = performance.now();

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = Math.abs(y - lastScrollY);
    lastScrollY = y;

    // Inject smooth velocity boost on scroll
    marquees.forEach(m => {
      if (m.el) {
        m.boost = Math.min(m.boost + delta * 15, 800);
      }
    });

    updateScrollProgress();
    updateNavbar();
    updateProcessTimeline();
    updateHorizontalScroll();
  }, { passive: true });

  const renderLoop = (now) => {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    marquees.forEach(m => {
      if (!m.el) return;
      const singleWidth = m.el.scrollWidth / 2;
      
      // Exponential decay of velocity boost
      m.boost *= Math.pow(0.05, dt);
      
      // Smoothly approach target speed
      const targetSpeed = m.speed + m.boost;
      m.currentSpeed += (targetSpeed - m.currentSpeed) * Math.min(1, dt * 7);

      m.offset += m.currentSpeed * dt * m.dir;

      if (singleWidth > 0) {
        m.offset = ((m.offset % singleWidth) + singleWidth) % singleWidth;
      }

      m.el.style.transform = `translate3d(${-m.offset}px, 0, 0)`;
    });

    requestAnimationFrame(renderLoop);
  };
  requestAnimationFrame(renderLoop);

  // Initial calls
  updateScrollProgress();
  updateNavbar();
  updateProcessTimeline();
  updateHorizontalScroll();

  // --- 12. FAQ ACCORDION ---
  document.querySelectorAll('.accordion-item').forEach(item => {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');

    if (head && body) {
      head.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        document.querySelectorAll('.accordion-item').forEach(acc => {
          acc.classList.remove('active');
          const b = acc.querySelector('.accordion-body');
          if (b) b.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // --- 13. INTERACTIVE SERVICE PICKER CARDS IN CONTACT FORM ---
  const pickerCards = document.querySelectorAll('.picker-card');
  const selectedServiceInput = document.getElementById('selectedService');

  if (pickerCards.length && selectedServiceInput) {
    pickerCards.forEach(card => {
      card.addEventListener('click', () => {
        pickerCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const val = card.getAttribute('data-val');
        if (val) selectedServiceInput.value = val;
      });
    });
  }
});
