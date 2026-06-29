import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCircuit } from './circuit.js';

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════════════
   LENIS — buttery smooth scroll
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
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -76, duration: 1.4 });
  });
});


/* ════════════════════════════════════════════════════════════
   NAV — scroll state + active section tracking
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
    let current = '';
    document.querySelectorAll('section[id]').forEach((s) => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
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
document.querySelectorAll('.mobile-link, .mobile-cta-link').forEach((l) => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });


/* ════════════════════════════════════════════════════════════
   CIRCUIT + HERO SEQUENCE
   Circuit draws first (~1.6s), then hero text animates in.
   Both run simultaneously — circuit draw is background action.
════════════════════════════════════════════════════════════ */
function startHeroSequence() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Beat 1 — top border line draws left → right
  tl.to('#heroBorderTop', { width: '100%', duration: 0.7, ease: 'power2.inOut' });

  // Beat 2 — label strip fades up
  tl.to('#heroLabel', { y: 0, opacity: 1, duration: 0.45 }, '-=0.2');

  // Beat 3 — headline lines rise from mask, staggered
  tl.to('.lm-inner', {
    y: 0,
    duration: 0.85,
    stagger: 0.11,
  }, '-=0.15');

  // Beat 4 — copper rule draws left → right
  tl.to('#heroRule', { width: '100%', duration: 0.9, ease: 'power3.inOut' }, '-=0.3');

  // Beat 5 — bottom strip rises
  tl.to('#heroStrip', { y: 0, opacity: 1, duration: 0.55 }, '-=0.35');

  // Beat 6 — scroll cue line starts its loop (CSS handles it, just show the element)
  tl.to('#heroScroll', { opacity: 1, duration: 0.4 }, '-=0.2');
}

// Start circuit draw immediately, hero text starts after 0.2s delay
initCircuit();
gsap.delayedCall(0.2, startHeroSequence);

// Hero circuit parallax on scroll
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


/* ════════════════════════════════════════════════════════════
   SERVICES — scroll reveal per item
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
   ABOUT — heading lines, image wipe, divider, pillars
════════════════════════════════════════════════════════════ */
ScrollTrigger.create({
  trigger: '.about',
  start: 'top 72%',
  once: true,
  onEnter: () => {
    gsap.to('.js-about-word', {
      y: 0,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out',
    });
  },
});

ScrollTrigger.create({
  trigger: '.js-about-divider',
  start: 'top 84%',
  once: true,
  onEnter: () => {
    document.querySelector('.js-about-divider').classList.add('live');
    document.querySelectorAll('.js-pillar').forEach((li, i) => {
      setTimeout(() => li.classList.add('live'), 400 + i * 100);
    });
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

// Stat block entrance + count-up
gsap.fromTo('.js-about-stat',
  { y: 24, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.6, stagger: 0.14, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-right', start: 'top 76%', once: true },
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
   SECTION HEADINGS — eyebrow + heading entrance
════════════════════════════════════════════════════════════ */
['.services', '.process', '.contact'].forEach((sel) => {
  const sec = document.querySelector(sel);
  if (!sec) return;
  const ey = sec.querySelector('.eyebrow');
  const h  = sec.querySelector('.sec-heading');
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
gsap.fromTo('.contact-block, .contact-map',
  { y: 22, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', once: true },
  }
);


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
