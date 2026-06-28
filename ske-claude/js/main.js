'use strict';

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     UTILITY
  ============================================================ */
  function initPathAnimation(el) {
    if (!el || !el.getTotalLength) return;
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    return len;
  }

  /* ============================================================
     NAVIGATION — scroll state & active links
  ============================================================ */
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
      nav.classList.toggle('is-scrolled', self.progress > 0);
    },
  });

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: () => {
      let current = '';
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      navLinks.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
      });
    },
  });

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobile-menu');
  const menuClose    = document.getElementById('menu-close');
  const mobileLinks  = document.querySelectorAll('.mobile-link, .mobile-cta');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  mobileLinks.forEach((l) => l.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ============================================================
     HERO ANIMATION SEQUENCE
  ============================================================ */
  const circuitPaths = document.querySelectorAll('.c-path');
  const circuitNodes = document.querySelectorAll('.c-node, .c-node-sm');

  // Initialise circuit path stroke-dashoffset
  circuitPaths.forEach((p) => initPathAnimation(p));

  const heroTl = gsap.timeline({ delay: 0.1 });

  // Circuit traces draw themselves
  heroTl.to(circuitPaths, {
    strokeDashoffset: 0,
    duration: 2.8,
    stagger: 0.12,
    ease: 'power2.inOut',
  }, 0);

  // Node dots pop in after traces
  heroTl.to(circuitNodes, {
    opacity: 1,
    scale: 1,
    duration: 0.3,
    stagger: 0.06,
    ease: 'power2.out',
    transformOrigin: 'center center',
  }, 1.2);

  // Label slides up
  heroTl.to('.hero-label', {
    y: 0,
    opacity: 1,
    duration: 0.65,
    ease: 'power3.out',
  }, 0.4);

  // Headline words lift into view
  heroTl.to('.hero-word', {
    y: 0,
    duration: 0.75,
    stagger: 0.14,
    ease: 'power3.out',
  }, 0.7);

  // Sub-line
  heroTl.to('.hero-sub', {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
  }, 1.35);

  // CTA buttons
  heroTl.to('.hero-cta', {
    y: 0,
    opacity: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
  }, 1.55);

  // Scroll indicator
  heroTl.to('.scroll-indicator', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out',
  }, 2.0);

  /* ============================================================
     SERVICES — wipe reveal + icon stroke draw
  ============================================================ */
  const servicePanels = document.querySelectorAll('.service-panel');
  const serviceIconPaths = document.querySelectorAll('.service-icon svg path, .service-icon svg circle, .service-icon svg rect');

  // Init icon stroke animations
  serviceIconPaths.forEach((el) => {
    if (el.getTotalLength) {
      const len = el.getTotalLength();
      if (len > 0) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    }
  });

  servicePanels.forEach((panel, i) => {
    gsap.fromTo(panel,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0.6 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 82%',
        },
        delay: i * 0.08,
      }
    );
  });

  // Service icon strokes draw on scroll
  ScrollTrigger.create({
    trigger: '.services-list',
    start: 'top 70%',
    onEnter: () => {
      gsap.to(serviceIconPaths, {
        strokeDashoffset: 0,
        duration: 1.1,
        stagger: 0.04,
        ease: 'power2.out',
        delay: 0.3,
      });
    },
  });

  /* ============================================================
     ABOUT — heading words, rule line, value stagger
  ============================================================ */
  const aboutWords = document.querySelectorAll('.about-heading .reveal-word');

  ScrollTrigger.create({
    trigger: '.about',
    start: 'top 72%',
    onEnter: () => {
      gsap.to(aboutWords, {
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.to('.about-body', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2,
      });
    },
  });

  // About rule — triggered slightly later
  ScrollTrigger.create({
    trigger: '.about-rule',
    start: 'top 85%',
    onEnter: () => {
      document.querySelector('.about-rule').classList.add('is-visible');

      const values = document.querySelectorAll('.about-value');
      values.forEach((v, i) => {
        setTimeout(() => v.classList.add('is-visible'), 400 + i * 110);
      });
    },
  });

  // Set initial states for about section
  gsap.set('.about-body', { opacity: 0, y: 16 });

  /* ============================================================
     PROCESS — step reveals + connector line scrub
  ============================================================ */
  const processLine = document.querySelector('.process-line');

  if (processLine) {
    const len = processLine.getTotalLength();
    gsap.set(processLine, { strokeDasharray: len, strokeDashoffset: len });

    gsap.to(processLine, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-body',
        start: 'top 70%',
        end: 'bottom 35%',
        scrub: 1.2,
      },
    });
  }

  document.querySelectorAll('.process-step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 78%',
      onEnter: () => step.classList.add('is-visible'),
    });
  });

  /* ============================================================
     PORTFOLIO — card stagger reveal
  ============================================================ */
  gsap.fromTo('.portfolio-card',
    { y: 32, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.55,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 78%',
      },
    }
  );

  /* ============================================================
     CONTACT — section reveal
  ============================================================ */
  gsap.fromTo('.contact-left > *',
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 72%',
      },
    }
  );

  gsap.fromTo('.contact-right',
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 72%',
      },
      delay: 0.2,
    }
  );

  /* ============================================================
     FOOTER — columns stagger + bottom line
  ============================================================ */
  gsap.fromTo('.footer-col',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer-grid',
        start: 'top 88%',
      },
    }
  );

  ScrollTrigger.create({
    trigger: '.footer-bottom',
    start: 'top 92%',
    onEnter: () => {
      document.querySelector('.footer-bottom-line').classList.add('is-visible');
    },
  });

  /* ============================================================
     SECTION HEADERS — generic wipe-up for all section headings
  ============================================================ */
  document.querySelectorAll('.section-header').forEach((header) => {
    const label   = header.querySelector('.section-label');
    const heading = header.querySelector('.section-heading');

    gsap.set([label, heading].filter(Boolean), { y: 20, opacity: 0 });

    ScrollTrigger.create({
      trigger: header,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(label, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
        });
        gsap.to(heading, {
          y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.1,
        });
      },
    });
  });

  /* ============================================================
     SMOOTH ANCHOR SCROLL
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
