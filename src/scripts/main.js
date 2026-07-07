import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCircuit } from './circuit.js';
import { initConsent } from './consent.js';
import './motion-enhancements.js';

initConsent();

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════════════
   LENIS: buttery smooth scroll
════════════════════════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Smooth anchor click scrolling (respects Lenis)
const navOffset = () => -(document.getElementById('nav')?.offsetHeight || 76);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: navOffset(), duration: 1.4 });
  });
});


/* ════════════════════════════════════════════════════════════
   NAV: scroll state + active section tracking
════════════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

ScrollTrigger.create({
  start: 80,
  onUpdate: (s) => nav.classList.toggle('scrolled', s.progress > 0),
});

ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: () => {
    const navH = document.getElementById('nav')?.offsetHeight || 76;
    let current = '';
    document.querySelectorAll('section[id]').forEach((s) => {
      if (window.scrollY >= s.offsetTop - navH - 64) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  },
});


/* ════════════════════════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');

const openMenu  = () => {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
};
const closeMenu = () => {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

hamburger.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link, .mobile-cta-link, .mobile-wa-link').forEach((l) => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });


/* ════════════════════════════════════════════════════════════
   CIRCUIT + HERO SEQUENCE
   Circuit draws first (~1.6s), then hero text animates in.
   Both run simultaneously: circuit draw is background action.
════════════════════════════════════════════════════════════ */
const heroReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroEl = document.getElementById('hero');

function revealHeroStatic() {
  gsap.set('#heroGlow', { xPercent: -50, yPercent: -50 });
  gsap.set(['#heroBorderTop', '#heroRule'], { width: '100%' });
  gsap.set(['#heroLabel', '#heroStrip', '#heroScroll', '#heroGlow'], { opacity: 1, y: 0, scale: 1, filter: 'none' });
  gsap.set('.hero-headline .lm-inner', { y: 0, rotationX: 0, opacity: 1, filter: 'none' });
  gsap.set('.hero-label-item, .hero-strip-desc, .hero-strip .btn-ghost, .btn-primary, .hero-stats', { opacity: 1, y: 0 });
  document.querySelector('.hero-grid')?.classList.add('is-visible', 'is-revealed');
  document.getElementById('heroRule')?.classList.add('is-live');
  document.getElementById('heroBorderTop')?.classList.add('is-live');
  document.getElementById('heroGlow')?.classList.add('is-active');
  document.getElementById('heroHeadline')?.classList.add('is-revealed');
  document.querySelector('.hero-period')?.classList.add('is-lit');
}

function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container || heroReducedMotion) return;

  for (let i = 0; i < 32; i++) {
    const p = document.createElement('span');
    p.className = 'hero-particle';
    container.appendChild(p);
  }

  const floatParticle = (p) => {
    const x = gsap.utils.random(4, 96);
    const size = gsap.utils.random(1.5, 3.5);
    gsap.set(p, {
      left: `${x}%`,
      top: `${gsap.utils.random(72, 98)}%`,
      width: size,
      height: size,
      opacity: gsap.utils.random(0.15, 0.65),
      x: 0,
      y: 0,
    });
    gsap.to(p, {
      y: gsap.utils.random(-90, -200),
      x: gsap.utils.random(-35, 35),
      opacity: 0,
      duration: gsap.utils.random(2.8, 6.5),
      ease: 'power1.out',
      onComplete: () => floatParticle(p),
    });
  };

  gsap.utils.toArray('.hero-particle').forEach((p, i) => {
    gsap.delayedCall(i * 0.08, () => floatParticle(p));
  });
}

function initHeroMouseParallax() {
  if (!heroEl || heroReducedMotion) return;

  let raf = null;
  heroEl.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const rect = heroEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to('#heroGlow', {
        x: x * 48,
        y: y * 32,
        duration: 1.1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to('#heroCircuit', {
        x: x * -22,
        y: y * -14,
        duration: 1.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to('#heroHeadline', {
        x: x * 10,
        y: y * 6,
        rotationY: x * 2.5,
        rotationX: y * -1.5,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  });

  heroEl.addEventListener('mouseleave', () => {
    gsap.to(['#heroGlow', '#heroCircuit', '#heroHeadline'], {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 1.4,
      ease: 'power3.out',
    });
  });
}

function playHeroIntro() {
  const flash = document.getElementById('heroFlash');
  const scan = document.getElementById('heroScan');
  const grid = document.querySelector('.hero-grid');

  const intro = gsap.timeline();

  // Beat 0: power surge flash
  intro.fromTo(flash,
    { opacity: 0 },
    { opacity: 1, duration: 0.06, ease: 'power4.in' },
    0
  );
  intro.to(flash, { opacity: 0, duration: 0.55, ease: 'power3.out' }, 0.06);

  // Beat 0b: electric scan sweeps top → bottom
  intro.fromTo(scan,
    { top: '0%', opacity: 0, scaleX: 0.4 },
    { top: '0%', opacity: 1, scaleX: 1, duration: 0.08, ease: 'power2.out' },
    0.02
  );
  intro.to(scan, {
    top: '100%',
    opacity: 0.85,
    duration: 0.85,
    ease: 'power2.inOut',
  }, 0.1);
  intro.to(scan, { opacity: 0, duration: 0.2 }, 0.95);

  // Grid blooms in behind
  intro.fromTo(grid,
    { opacity: 0, scale: 1.06 },
    { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' },
    0.15
  );
  intro.call(() => grid?.classList.add('is-visible', 'is-revealed'), null, 1.2);

  return intro;
}

function startHeroSequence() {
  if (heroReducedMotion) {
    revealHeroStatic();
    return;
  }

  initHeroParticles();

  gsap.set('#heroGlow', { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' });
  gsap.set('.hero-headline .lm-inner', {
    filter: 'blur(18px)',
    rotationX: -82,
    transformOrigin: '50% 100%',
    opacity: 0,
  });
  gsap.set('#heroHeadline', { transformPerspective: 900 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Run cinematic intro in parallel
  tl.add(playHeroIntro(), 0);

  // Ambient glow erupts behind headline
  tl.fromTo('#heroGlow',
    { opacity: 0, scale: 0.75 },
    { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out' },
    0.08
  );

  // Top border draws with energy
  tl.to('#heroBorderTop', {
    width: '100%',
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => document.getElementById('heroBorderTop')?.classList.add('is-live'),
  }, 0.35);

  // Label items cascade in
  tl.to('#heroLabel', { opacity: 1, duration: 0.01 }, 0.55);
  tl.fromTo('.hero-label-item',
    { y: 18, opacity: 0, letterSpacing: '0.28em' },
    { y: 0, opacity: 1, letterSpacing: '0.14em', duration: 0.5, stagger: 0.08, ease: 'power4.out' },
    0.6
  );

  // Headline: dramatic 3D flip + blur resolve
  tl.to('.hero-headline .lm-inner', {
    y: 0,
    rotationX: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 1.05,
    stagger: 0.14,
    ease: 'power4.out',
  }, 0.72);

  // Headline lands: micro impact shake
  tl.fromTo('#heroHeadline',
    { scale: 1 },
    { scale: 1.012, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1 },
    1.55
  );

  // Copper period detonates
  tl.fromTo('.hero-period',
    { scale: 1, rotation: 0 },
    { scale: 1.6, rotation: -8, duration: 0.2, ease: 'power4.out' },
    1.48
  );
  tl.to('.hero-period', {
    scale: 1,
    rotation: 0,
    duration: 0.55,
    ease: 'elastic.out(1, 0.45)',
    onComplete: () => {
      document.querySelector('.hero-period')?.classList.add('is-lit');
      document.getElementById('heroHeadline')?.classList.add('is-revealed');
    },
  }, 1.68);

  // Copper rule charges across
  tl.to('#heroRule', {
    width: '100%',
    duration: 1.05,
    ease: 'power4.inOut',
    onComplete: () => document.getElementById('heroRule')?.classList.add('is-live'),
  }, 1.15);

  // Strip content rockets up
  tl.to('#heroStrip', { y: 0, opacity: 1, duration: 0.01 }, 1.38);
  tl.fromTo('.hero-strip-desc',
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.58, ease: 'power4.out' },
    1.42
  );
  tl.fromTo('.btn-primary',
    { y: 24, opacity: 0, scale: 0.94 },
    { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' },
    1.52
  );
  tl.fromTo('.hero-strip .btn-ghost',
    { y: 24, opacity: 0, scale: 0.94 },
    { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' },
    1.60
  );
  tl.fromTo('.hero-stats',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.65, ease: 'power4.out' },
    1.58
  );

  // Scroll cue materialises
  tl.fromTo('#heroScroll',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
    1.78
  );
  tl.call(() => document.getElementById('heroGlow')?.classList.add('is-active'), null, 1.85);
}

// Circuit power-on syncs with hero flash + glow burst
initCircuit(() => {
  if (heroReducedMotion) return;
  const flash = document.getElementById('heroFlash');
  gsap.timeline()
    .to(flash, { opacity: 0.7, duration: 0.05, ease: 'power4.in' }, 0)
    .to(flash, { opacity: 0, duration: 0.4, ease: 'power3.out' }, 0.05);
  gsap.fromTo('#heroGlow',
    { scale: 1 },
    { scale: 1.1, duration: 0.22, ease: 'power3.out', yoyo: true, repeat: 1 },
  );
});

initHeroMouseParallax();
gsap.delayedCall(0.15, startHeroSequence);

// Hero scroll cue: smooth scroll to services
document.getElementById('heroScroll')?.addEventListener('click', () => {
  const services = document.getElementById('services');
  if (services) lenis.scrollTo(services, { offset: navOffset(), duration: 1.4 });
});

// Hero parallax on scroll: circuit + glow drift at different rates
gsap.to('#heroCircuit', {
  yPercent: 16,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.2,
  },
});

gsap.to('#heroGlow', {
  yPercent: -42,
  scale: 1.05,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  },
});


/* ════════════════════════════════════════════════════════════
   SERVICES: scroll reveal per item
════════════════════════════════════════════════════════════ */
document.querySelectorAll('.js-service-item').forEach((item, i) => {
  ScrollTrigger.create({
    trigger: item,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      setTimeout(() => item.classList.add('is-live'), i * 80);
    },
  });
});


/* ════════════════════════════════════════════════════════════
   ABOUT: heading lines, image wipe, divider, pillars
════════════════════════════════════════════════════════════ */
ScrollTrigger.create({
  trigger: '.about',
  start: 'top 72%',
  once: true,
  onEnter: () => {
    const eyebrow = document.querySelector('.js-about-eyebrow');
    if (eyebrow) {
      gsap.to(eyebrow, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
    }
    gsap.to('.js-about-word', {
      y: 0,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out',
    });
  },
});

gsap.fromTo('.js-about-body',
  { y: 18, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-intro', start: 'top 74%', once: true },
  }
);

const aboutImg = document.querySelector('.about-img-wrap img');
if (aboutImg) {
  gsap.to(aboutImg, {
    yPercent: 6,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-img-wrap',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
    },
  });
}

ScrollTrigger.create({
  trigger: '.js-about-divider',
  start: 'top 84%',
  once: true,
  onEnter: () => {
    document.querySelector('.js-about-divider').classList.add('live');
  },
});

// About image wipe reveal
ScrollTrigger.create({
  trigger: '.js-about-img',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    document.querySelector('.js-about-img').classList.add('live');
  },
});

// Credentials + KEI entrance (translate only — text stays readable)
gsap.fromTo('.js-about-stat, .js-pillar',
  { y: 14 },
  {
    y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-lower', start: 'top 82%', once: true },
  }
);

// Count-up animation on the stat number
const statNum = document.querySelector('.js-stat-num');
if (statNum) {
  const target = parseInt(statNum.textContent, 10) || 10;
  ScrollTrigger.create({
    trigger: statNum,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate() { statNum.textContent = Math.round(obj.val) + '+'; },
      });
    },
  });
}


/* ════════════════════════════════════════════════════════════
   SECTION HEADINGS: eyebrow + heading entrance
════════════════════════════════════════════════════════════ */
['.services', '.process', '.contact'].forEach((sel) => {
  const sec = document.querySelector(sel);
  if (!sec) return;
  const ey = sec.querySelector('.eyebrow');
  const h  = sec.querySelector('.sec-heading, .contact-heading');
  if (ey) gsap.set(ey, { y: 20, opacity: 0 });
  if (h)  gsap.set(h,  { y: 30, opacity: 0 });
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      const sq = gsap.timeline();
      if (ey) sq.to(ey, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
      if (h)  sq.to(h,  { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '-=0.1');
    },
  });
});


/* ════════════════════════════════════════════════════════════
   PROCESS STEPS
════════════════════════════════════════════════════════════ */
const processIntro = document.querySelector('.process-intro');
if (processIntro) {
  gsap.fromTo(processIntro,
    { y: 14, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: '.process-header', start: 'top 82%', once: true },
    }
  );
}

document.querySelectorAll('.js-step').forEach((step, i) => {
  ScrollTrigger.create({
    trigger: step,
    start: 'top 84%',
    once: true,
    onEnter: () => { setTimeout(() => step.classList.add('live'), i * 90); },
  });
});


/* ════════════════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════════════════ */
gsap.fromTo('.js-contact-card',
  { y: 28, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-layout', start: 'top 82%', once: true },
  }
);

const contactLead = document.querySelector('.contact-lead');
if (contactLead) {
  gsap.fromTo(contactLead,
    { y: 16, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-header', start: 'top 85%', once: true },
    }
  );
}


/* ════════════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════════════ */
gsap.fromTo('.footer-brand, .footer-col',
  { y: 18, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: 'power3.out',
    scrollTrigger: { trigger: '.footer-top', start: 'top 92%', once: true },
  }
);
