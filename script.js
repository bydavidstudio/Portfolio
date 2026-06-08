/* -------------------------------------------------------------------------- */
/*  Show elements immediately */
/* -------------------------------------------------------------------------- */
gsap.set('.contact-form-card, .faq-item', {
  opacity: 1,
  y: 0,
});

/* -------------------------------------------------------------------------- */
/*  HERO BACKGROUND TEXT – starts hidden (SlideReveal) and animates in        */
/* -------------------------------------------------------------------------- */
gsap.set('.hero-bg-text span', {
  opacity: 0,
  y: '120%',
});

const heroBgTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 1.2 });
heroBgTl.to('.hero-bg-text span', {
  opacity: 1,
  y: '0%',
  duration: 0.7,
  stagger: 0.08,
});

/* -------------------------------------------------------------------------- */
/*  HERO IMAGE ENTRANCE – crazy welcome animation                             */
/* -------------------------------------------------------------------------- */
const heroImage = document.querySelector('.hero-image');
const heroSideprofile = document.querySelector('.hero-sideprofile');

if (heroSideprofile) {
  const crazyTl = gsap.timeline({ delay: 0.1 });
  crazyTl.from(heroSideprofile, {
    opacity: 0,
    scale: 0,
    rotation: -720,
    y: 500,
    x: -120,
    skewX: 40,
    filter: 'blur(60px)',
    duration: 1.6,
    ease: 'power4.in',
  });
  crazyTl.to(heroSideprofile, {
    scale: 1.25,
    rotation: 15,
    y: -60,
    x: 30,
    skewX: -10,
    filter: 'blur(0px)',
    duration: 2.8,
    ease: 'elastic.out(1, 0.32)',
  });
  crazyTl.to(heroSideprofile, {
    scale: 1,
    rotation: 0,
    y: 0,
    x: 0,
    skewX: 0,
    duration: 0.7,
    ease: 'power3.out',
  });
}

if (heroImage) {
  gsap.from(heroImage, {
    opacity: 0,
    y: 320,
    x: 100,
    scale: 0.15,
    rotation: 22,
    filter: 'blur(34px)',
    duration: 3.2,
    ease: 'elastic.out(1, 0.38)',
    delay: 0.3,
  });
}

/* -------------------------------------------------------------------------- */
/*  SCROLL PARALLAX + CLIP for hero background text                           */
/* -------------------------------------------------------------------------- */
if (typeof ScrollTrigger !== 'undefined') {
  gsap.to('.hero-bg-text', {
    y: 320,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.3,
      invalidateOnRefresh: true,
    },
  });

  const bgText = document.querySelector('.hero-bg-text');
  const stripe = document.querySelector('.hero-image-stripe');

  if (bgText && stripe) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.3,
      onUpdate: () => {
        const textBottom = bgText.getBoundingClientRect().bottom;
        const stripeTop = stripe.getBoundingClientRect().top;
        const textHeight = bgText.offsetHeight;

        if (textBottom <= stripeTop) {
          bgText.style.clipPath = 'inset(0 0 0% 0)';
        } else {
          const overlap = textBottom - stripeTop;
          const clipValue = Math.max(0, Math.min(100, (overlap / textHeight) * 100));
          bgText.style.clipPath = `inset(0 0 ${clipValue}% 0)`;
        }
      },
    });
  }
}

/* -------------------------------------------------------------------------- */
/*  CUSTOM CURSOR                                                             */
/* -------------------------------------------------------------------------- */
const cursor = document.querySelector('.custom-cursor');
const hoverElements = document.querySelectorAll(
  'a, button, .project-item, .service-card, .benefit-item, .about-service-card'
);

document.addEventListener('mousemove', (e) => {
  if (!cursor) return;
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: 'power2.out',
  });
});

hoverElements.forEach((el) => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
});

document.querySelectorAll('.about-service-card').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

/* -------------------------------------------------------------------------- */
/*  FADE IN UP HELPER                                                         */
/* -------------------------------------------------------------------------- */
const fadeInUp = (selector, y = 50) => {
  document.querySelectorAll(selector).forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        end: 'top 60%',
        toggleActions: 'play none none none',
      },
    });
  });
};

/* -------------------------------------------------------------------------- */
/*  SECTION TITLES & SUBTITLES                                                */
/* -------------------------------------------------------------------------- */
document.querySelectorAll('.section-title').forEach((title) => {
  gsap.to(title, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 92%',
      end: 'top 60%',
      toggleActions: 'play none none none',
    },
  });
});

fadeInUp('.section-subtitle', 30);

/* -------------------------------------------------------------------------- */
/*  ABOUT – headline lines + description + eyebrow tag                        */
/* -------------------------------------------------------------------------- */
const aboutLines = document.querySelectorAll('.about-hero-line');
if (aboutLines.length) {
  gsap.to(aboutLines, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-redesign',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });
}

const aboutDesc = document.querySelector('.about-redesign .about-description');
if (aboutDesc) {
  gsap.to(aboutDesc, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    delay: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-redesign',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

const aboutEyebrow = document.querySelector('.about-redesign .section-eyebrow');
if (aboutEyebrow) {
  gsap.to(aboutEyebrow, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-redesign',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

const aboutTag = document.querySelector('.about-redesign .about-eyebrow-tag');
if (aboutTag) {
  gsap.to(aboutTag, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-redesign',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  ABOUT SERVICE CARDS – staggered scale + rotation entrance                 */
/* -------------------------------------------------------------------------- */
const aboutCards = document.querySelectorAll('.about-redesign .about-service-card');
aboutCards.forEach((card, i) => {
  gsap.set(card, {
    opacity: 0,
    y: 50,
    scale: 0.92,
    rotation: i % 2 === 0 ? -3 : 3,
  });

  gsap.to(card, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotation: 0,
    duration: 0.8,
    delay: i * 0.12,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.about-services-list',
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
});

/* -------------------------------------------------------------------------- */
/*  PORTFOLIO NOTE & PROJECT ITEMS                                            */
/* -------------------------------------------------------------------------- */
gsap.from('.portfolio-note', {
  opacity: 0,
  y: 20,
  duration: 0.85,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.portfolio-note',
    start: 'top 88%',
    toggleActions: 'play none none none',
  },
});

document.querySelectorAll('.project-item').forEach((item, i) => {
  const img = item.querySelector('.project-image img');
  const info = item.querySelector('.project-info');

  if (img) {
    gsap.set(img, { opacity: 0, scale: 0.85, y: 30 });
  }
  if (info) {
    gsap.set(info, { opacity: 0, x: i % 2 === 0 ? -30 : 30 });
  }
  gsap.set(item, { opacity: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });

  tl.to(info, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: 'power2.out',
  }, 0);

  tl.to(img, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
  }, 0.1);
});

/* -------------------------------------------------------------------------- */
/*  SERVICE CARDS + FEATURE LIST ITEMS                                        */
/* -------------------------------------------------------------------------- */
document.querySelectorAll('.service-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    delay: i * 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });

  card.querySelectorAll('.service-features li').forEach((feature, j) => {
    gsap.to(feature, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: i * 0.15 + j * 0.05 + 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
});

/* -------------------------------------------------------------------------- */
/*  PROCESS STEPS                                                             */
/* -------------------------------------------------------------------------- */
document.querySelectorAll('.process-step-vertical').forEach((step, i) => {
  gsap.to(step, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    delay: i * 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: step,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
});

/* -------------------------------------------------------------------------- */
/*  BENEFIT ITEMS                                                             */
/* -------------------------------------------------------------------------- */
document.querySelectorAll('.benefit-item').forEach((item, i) => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    delay: i * 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
});

/* -------------------------------------------------------------------------- */
/*  FAQ ACCORDION                                                             */
/* -------------------------------------------------------------------------- */
document.querySelectorAll('.faq-item').forEach((item, i) => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 0.65,
    delay: i * 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.faq',
      start: 'top 92%',
      toggleActions: 'play none none none',
    },
  });
});

document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach((faq) => faq.classList.remove('active'));

    if (!isActive) {
      item.classList.add('active');
    }
  });
});

/* -------------------------------------------------------------------------- */
/*  CONTACT                                                                   */
/* -------------------------------------------------------------------------- */
document.querySelectorAll('.contact-form-card').forEach((card) => {
  gsap.set(card, { opacity: 1, y: 0 });
});
/* -------------------------------------------------------------------------- */
gsap.from('.contact-form-card', {
  opacity: 0,
  y: 30,
  duration: 0.85,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.contact',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                  */
/* -------------------------------------------------------------------------- */
gsap.from('.footer', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 95%',
    toggleActions: 'play none none none',
  },
});

gsap.from('.footer-brand, .footer-nav, .footer-contact', {
  opacity: 0,
  y: 20,
  duration: 0.7,
  stagger: 0.12,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 92%',
    toggleActions: 'play none none none',
  },
});

/* -------------------------------------------------------------------------- */
/*  ACTIVE NAV LINK ON SCROLL                                                 */
/* -------------------------------------------------------------------------- */
const navLinksAll = document.querySelectorAll('.nav-links a, .nav-announcement-cta');
const sections = [];
navLinksAll.forEach((link) => {
  const id = link.getAttribute('href');
  if (id && id.startsWith('#') && id !== '#') {
    const section = document.querySelector(id);
    if (section) sections.push({ link, section });
  }
});

if (sections.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const active = sections.find((s) => s.section === entry.target);
          if (active) {
            navLinksAll.forEach((l) => l.classList.remove('active'));
            active.link.classList.add('active');
          }
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(({ section }) => observer.observe(section));
}
