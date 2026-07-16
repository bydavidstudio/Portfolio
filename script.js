/**
 * ==========================================================================
 * byDavidStudio | PROFESSIONAL VANILLA JS ENGINE
 * Handles: Preloader, Scroll Acceleration Marquees, 3D Tilt, Magnetic UI,
 * Horizontal Scroll Showcase, Custom Cursor, Full-screen Background & FAQ.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // --- 1. PRELOADER ---
  const preloader = document.querySelector('.premium-preloader');
  const progressVal = document.querySelector('.preloader-perc');
  const progressBar = document.querySelector('.preloader-bar');
  let perc = 0;

  // The full-screen preloader is attractive on desktop, but it becomes the
  // mobile LCP element. Skip it on touch/small screens so real content paints
  // immediately and the page remains scrollable while assets load.
  const skipPreloader = isTouch || window.matchMedia('(max-width: 768px)').matches;
  document.body.classList.add('loading');

  if (skipPreloader) {
    if (preloader) preloader.classList.add('done');
    document.body.classList.remove('loading');
  } else {
    const loaderInterval = setInterval(function () {
      perc += Math.floor(Math.random() * 14) + 8;
      if (perc >= 100) {
        perc = 100;
        clearInterval(loaderInterval);
        setTimeout(function () {
          if (preloader) preloader.classList.add('done');
          document.body.classList.remove('loading');
        }, 350);
      }
      if (progressVal) progressVal.textContent = (perc < 10 ? '0' : '') + perc + '%';
      if (progressBar) progressBar.style.width = perc + '%';
    }, 75);
  }

  // --- 2. TOP SCROLL PROGRESS BAR ---
  const scrollBar = document.querySelector('.scroll-progress-bar');
  const updateScrollProgress = function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = progress + '%';
  };

  // --- 3. NAVBAR SCROLL & MOBILE AUTO-HIDE/SHOW EFFECT ---
  const navbar = document.querySelector('.navbar');
  let prevScrollPos = window.scrollY;

  const updateNavbar = function () {
    if (!navbar) return;
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    if (window.innerWidth <= 1024 && !document.body.classList.contains('menu-open')) {
      if (currentScrollPos > prevScrollPos && currentScrollPos > 80) {
        navbar.classList.add('nav-hidden');
      } else if (prevScrollPos - currentScrollPos > 6 || currentScrollPos <= 40) {
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }
    prevScrollPos = currentScrollPos;
  };

  // --- 4. CUSTOM CURSOR (DESKTOP ONLY) ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const isTouchDevice =
    isTouch ||
    window.matchMedia('(pointer: coarse)').matches ||
    ('ontouchstart' in window && navigator.maxTouchPoints > 0) ||
    window.innerWidth <= 1024;

  if (isTouchDevice) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  } else if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    });

    const renderCursor = function () {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    document.querySelectorAll('a, button, input, textarea, select, .accordion-head, .magnetic-target').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorRing.classList.add('hover-active'); });
      el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hover-active'); });
    });
  }

  // --- 5. TOUCH-SAFE MAGNETIC BUTTONS ---
  if (!isTouch) {
    document.querySelectorAll('.magnetic-wrap').forEach(function (wrap) {
      const target = wrap.querySelector('.magnetic-target');
      if (!target) return;

      wrap.addEventListener('mousemove', function (e) {
        const rect = wrap.getBoundingClientRect();
        const relX = (e.clientX - rect.left) - rect.width / 2;
        const relY = (e.clientY - rect.top) - rect.height / 2;
        target.style.transform = 'translate(' + (relX * 0.28) + 'px, ' + (relY * 0.28) + 'px)';
      });

      wrap.addEventListener('mouseleave', function () {
        target.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // --- 5.5 FULL-SCREEN INTERACTIVE WAVE MESH BACKGROUND ---
  const bgCanvas = document.getElementById('bgInteractiveCanvas');
  // The interactive mesh is decorative and expensive on mobile. Skip it on
  // touch devices so it cannot compete with the hero for CPU/GPU time.
  if (bgCanvas && !isTouch) {
    const ctx = bgCanvas.getContext('2d');

    bgCanvas.style.touchAction = 'none';

    const isTouchBg = isTouch;
    const moteCount = isTouchBg ? 24 : 46;
    const pulseCount = isTouchBg ? 8 : 16;
    const bgSpacing = isTouchBg ? 86 : 74;

    if (ctx) {
      let width = bgCanvas.width = window.innerWidth;
      let height = bgCanvas.height = window.innerHeight;
      window.addEventListener('resize', function () {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
      });

      let mouseX = width / 2;
      let mouseY = height / 2;
      let currX = mouseX;
      let currY = mouseY;
      let lastX = mouseX;
      let lastY = mouseY;
      let mouseSpeed = 0;

      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      bgCanvas.addEventListener('touchmove', function (e) {
        if (e.touches.length > 0) {
          mouseX = e.touches[0].clientX;
          mouseY = e.touches[0].clientY;
        }
      }, { passive: true });

      const trail = [];

      const motes = Array.from({ length: moteCount }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.3 + Math.random() * 0.7,
          r: 0.6 + Math.random() * 1.8,
          drift: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random()
        };
      });

      const pulses = Array.from({ length: pulseCount }, function () {
        return {
          c: 0,
          r: 0,
          progress: Math.random(),
          speed: 0.01 + Math.random() * 0.016,
          color: Math.random() > 0.5 ? 'rgba(220, 56, 38, 0.9)' : 'rgba(243, 202, 131, 0.9)'
        };
      });

      function gridCounts() {
        return {
          gc: Math.ceil(width / bgSpacing) + 2,
          gr: Math.ceil(height / bgSpacing) + 2
        };
      }

      function getPoint(c, r, time, targetX, targetY, scrollShift) {
        const baseX = c * bgSpacing;
        const baseY = r * bgSpacing + scrollShift;

        const wx = Math.sin(baseY * 0.012 + time * 0.0011) * 12
          + Math.cos((baseX + baseY) * 0.006 - time * 0.0009) * 8;
        const wy = Math.sin(baseX * 0.012 + time * 0.0013) * 12
          + Math.cos((baseX - baseY) * 0.007 + time * 0.001) * 8;

        const dx = targetX - baseX;
        const dy = targetY - (baseY - scrollShift);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 300);
        const push = influence * influence * (34 + mouseSpeed * 1.6);
        const ang = Math.atan2(dy, dx);

        return {
          x: baseX + wx - Math.cos(ang) * push,
          y: baseY + wy - Math.sin(ang) * push,
          influence: influence
        };
      }

      function animBg() {
        ctx.clearRect(0, 0, width, height);

        currX += (mouseX - currX) * 0.08;
        currY += (mouseY - currY) * 0.08;
        const vX = currX - lastX;
        const vY = currY - lastY;
        mouseSpeed += (Math.min(60, Math.sqrt(vX * vX + vY * vY)) - mouseSpeed) * 0.12;
        lastX = currX;
        lastY = currY;

        const time = performance.now();
        const scrollShift = -(((window.scrollY * 0.15) % bgSpacing));

        const counts = gridCounts();
        const gc = counts.gc;
        const gr = counts.gr;

        trail.push({ x: currX, y: currY });
        if (trail.length > 24) trail.shift();

        const haloR = 420 + mouseSpeed * 5;
        const haloGrad = ctx.createRadialGradient(currX, currY, 8, currX, currY, haloR);
        haloGrad.addColorStop(0, 'rgba(243, 202, 131, ' + (0.14 + mouseSpeed * 0.004) + ')');
        haloGrad.addColorStop(0.4, 'rgba(220, 56, 38, 0.07)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(currX, currY, haloR, 0, Math.PI * 2);
        ctx.fill();

        const pts = [];
        for (let r = -1; r < gr; r++) {
          const row = [];
          for (let c = -1; c < gc; c++) {
            row.push(getPoint(c, r, time, currX, currY, scrollShift));
          }
          pts.push(row);
        }

        ctx.shadowBlur = 8;
        for (let r = 0; r < pts.length; r++) {
          const t = r / pts.length;
          const alpha = 0.16 + Math.sin(t * Math.PI) * 0.12;
          let color = 'rgba(220, 56, 38, ' + alpha + ')';
          let glow = 'rgba(220, 56, 38, 0.4)';
          if (t > 0.4) { color = 'rgba(217, 150, 50, ' + alpha + ')'; glow = 'rgba(217, 150, 50, 0.4)'; }
          if (t > 0.72) { color = 'rgba(15, 108, 79, ' + alpha + ')'; glow = 'rgba(15, 108, 79, 0.4)'; }
          ctx.strokeStyle = color;
          ctx.shadowColor = glow;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let c = 0; c < pts[r].length; c++) {
            const p = pts[r][c];
            if (c === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }

        for (let c = 0; c < gc + 1; c++) {
          const t = c / (gc + 1);
          const alpha = 0.1 + Math.sin(t * Math.PI) * 0.08;
          ctx.strokeStyle = 'rgba(20, 24, 21, ' + alpha + ')';
          ctx.shadowColor = 'rgba(217, 150, 50, 0.25)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          for (let r = 0; r < pts.length; r++) {
            const p = pts[r] && pts[r][c];
            if (!p) continue;
            if (r === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(243, 202, 131, 0.9)';
        for (let r = 0; r < pts.length; r++) {
          for (let c = 0; c < pts[r].length; c++) {
            const p = pts[r][c];
            if (p.influence > 0.12) {
              ctx.fillStyle = 'rgba(255, 226, 168, ' + (p.influence * 0.95) + ')';
              ctx.beginPath();
              ctx.arc(p.x, p.y, 1.4 + p.influence * 4.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.shadowBlur = 0;

        ctx.shadowBlur = 10;
        pulses.forEach(function (pulse) {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            pulse.r = Math.floor(Math.random() * (pts.length - 1));
            pulse.c = Math.floor(Math.random() * (gc - 1));
          }
          const rr = Math.min(pts.length - 1, pulse.r);
          const cc = Math.min(gc - 1, pulse.c);
          const p1 = pts[rr] && pts[rr][cc];
          const p2 = pts[rr] && pts[rr][cc + 1];
          if (p1 && p2) {
            const px = p1.x + (p2.x - p1.x) * pulse.progress;
            const py = p1.y + (p2.y - p1.y) * pulse.progress;
            ctx.shadowColor = pulse.color;
            ctx.fillStyle = pulse.color;
            ctx.beginPath();
            ctx.arc(px, py, 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.shadowBlur = 0;

        motes.forEach(function (m) {
          m.y -= m.drift * m.z;
          m.x += Math.sin(time * 0.0004 + m.phase) * 0.3;
          if (m.y < -10) { m.y = height + 10; m.x = Math.random() * width; }
          if (m.x < -10) m.x = width + 10;
          if (m.x > width + 10) m.x = -10;
          const a = (0.14 + Math.sin(time * 0.001 + m.phase) * 0.1) * m.z;
          const col = m.hue < 0.34 ? '220, 56, 38' : m.hue < 0.67 ? '217, 150, 50' : '15, 108, 79';
          ctx.fillStyle = 'rgba(' + col + ', ' + Math.max(0, a) + ')';
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * m.z, 0, Math.PI * 2);
          ctx.fill();
        });

        for (let i = 0; i < trail.length; i++) {
          const tt = trail[i];
          const a = (i / trail.length) * 0.4;
          ctx.fillStyle = 'rgba(243, 202, 131, ' + a + ')';
          ctx.beginPath();
          ctx.arc(tt.x, tt.y, (i / trail.length) * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        requestAnimationFrame(animBg);
      }
      requestAnimationFrame(animBg);
    }
  }

  // --- 6. MULTI-LAYER HOLOGRAPHIC 3D TILT ---
  const heroVisual = document.getElementById('heroVisual');
  const holoBorderWrap = document.querySelector('.holo-border-wrap');
  const holoCards = document.querySelectorAll('.holo-card');

  if (!isTouch && heroVisual && holoBorderWrap) {
    heroVisual.addEventListener('mousemove', function (e) {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      holoBorderWrap.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateZ(0)';

      holoCards.forEach(function (card, idx) {
        const factor = idx === 0 ? -16 : -20;
        card.style.transform = 'translate3d(' + (x * factor) + 'px, ' + (y * factor) + 'px, 30px) rotateY(' + (x * -6) + 'deg) rotateX(' + (-y * -6) + 'deg)';
      });
    });

    heroVisual.addEventListener('mouseleave', function () {
      holoBorderWrap.style.transform = 'rotateY(0deg) rotateX(0deg)';
      holoCards.forEach(function (card) {
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
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const waves = [
      { color: '#dc3826', speed: 18, y: -150, delay: 0 },
      { color: '#d99632', speed: 20, y: -250, delay: 80 },
      { color: '#0f6c4f', speed: 22, y: -350, delay: 160 }
    ];

    const columns = Math.floor(canvas.width / 24);
    const columnOffsets = Array.from({ length: columns }, function () { return Math.random() * 90 - 45; });

    const startTime = performance.now();
    function animateDrips(now) {
      const elapsed = now - startTime;
      if (elapsed > 1350) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach(function (wave) {
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
    menuBtn.addEventListener('click', function () {
      const isOpen = document.body.classList.toggle('menu-open');
      document.body.classList.toggle('no-scroll');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) triggerPaintDripping();
    });
  }
  document.querySelectorAll('.mega-link').forEach(function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('menu-open', 'no-scroll');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // --- 8. SCROLL REVEAL OBSERVER ---
  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  // --- 9. PROCESS TIMELINE PROGRESS ---
  const processItems = document.querySelectorAll('.step-item');
  const processProgress = document.getElementById('processProgress');
  const updateProcessTimeline = function () {
    if (!processItems.length || !processProgress) return;
    let activeCount = 0;
    processItems.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.65) {
        item.classList.add('active');
        activeCount++;
      } else {
        item.classList.remove('active');
      }
    });
    const progressPerc = (activeCount / processItems.length) * 100;
    processProgress.style.height = progressPerc + '%';
  };

  // --- 10. HORIZONTAL PORTFOLIO SCROLL ENGINE ---
  const horizWrapper = document.querySelector('.portfolio-scroll-wrapper');
  const horizTrack = document.querySelector('.portfolio-horizontal-track');
  const horizontalMobileMode = isTouch || window.matchMedia('(max-width: 768px)').matches;
  let horizontalMaxTranslate = 0;

  const recalculateHorizontalMetrics = function () {
    if (!horizTrack || horizontalMobileMode) return;
    horizontalMaxTranslate = Math.max(0, horizTrack.scrollWidth - window.innerWidth);
  };

  const updateHorizontalScroll = function () {
    if (!horizWrapper || !horizTrack || horizontalMobileMode) return;
    const rect = horizWrapper.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;

    if (scrollDistance <= 0) {
      horizTrack.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    let progress = rect.top <= 0 ? -rect.top / scrollDistance : 0;
    progress = Math.max(0, Math.min(1, progress));
    horizTrack.style.transform = 'translate3d(' + (-progress * horizontalMaxTranslate) + 'px, 0, 0)';
  };

  window.addEventListener('resize', function () {
    recalculateHorizontalMetrics();
    updateHorizontalScroll();
  }, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      recalculateHorizontalMetrics();
      updateHorizontalScroll();
    });
  }

  // --- 11. LIGHTWEIGHT MOBILE SECTION PARALLAX ---
  // Only two decorative pseudo-layers move by a small amount. No canvas,
  // blur filter or per-frame layout animation is used.
  const mobileParallaxEnabled = isTouch || window.matchMedia('(max-width: 768px)').matches;
  const parallaxTargets = mobileParallaxEnabled
    ? [document.querySelector('.hero-section'), document.querySelector('.portfolio-scroll-wrapper')]
    : [];

  const updateMobileParallax = function () {
    if (!mobileParallaxEnabled) return;
    const viewportCenter = window.innerHeight / 2;

    parallaxTargets.forEach(function (section) {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

      const sectionCenter = rect.top + rect.height / 2;
      const distanceFromCenter = sectionCenter - viewportCenter;
      const shift = Math.max(-34, Math.min(34, distanceFromCenter * -0.06));
      section.style.setProperty('--parallax-y', shift.toFixed(1) + 'px');
    });
  };

  // --- 12. COMPOSITOR-BASED MARQUEES + THROTTLED SCROLL ---
  // The marquees animate in CSS, which keeps them on the compositor and avoids
  // reading scrollWidth and writing transforms on every animation frame.
  let scrollFrame = 0;
  const handleScroll = function () {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(function () {
      updateScrollProgress();
      updateNavbar();
      updateProcessTimeline();
      updateHorizontalScroll();
      updateMobileParallax();
      scrollFrame = 0;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  recalculateHorizontalMetrics();

  // Initial calls
  updateScrollProgress();
  updateNavbar();
  updateProcessTimeline();
  updateHorizontalScroll();
  updateMobileParallax();

  // --- 13. FAQ ACCORDION ---
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');

    if (head && body) {
      head.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.accordion-item').forEach(function (acc) {
          acc.classList.remove('active');
          const b = acc.querySelector('.accordion-body');
          if (b) b.style.maxHeight = '';
        });

        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // --- 13. INTERACTIVE SERVICE PICKER CARDS IN CONTACT FORM ---
  var pickerCards = document.querySelectorAll('.picker-card, .nf-pick');
  var selectedServiceInput = document.getElementById('selectedService');

  if (pickerCards.length && selectedServiceInput) {
    pickerCards.forEach(function (card) {
      card.addEventListener('click', function () {
        pickerCards.forEach(function (c) { c.classList.remove('active'); });
        card.classList.add('active');
        var val = card.getAttribute('data-val');
        if (val) selectedServiceInput.value = val;
      });
    });
  }
});