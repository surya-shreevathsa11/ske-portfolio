import { animate, stagger } from 'motion';

/* ════════════════════════════════════════════════════════════
   MOTION ENHANCEMENTS
   Adds physics-based micro-interactions on top of the existing
   GSAP/Lenis scroll choreography: never touches it. Every effect
   here only sets inline transforms/opacity while it's active, then
   clears them so all existing CSS hover/transition rules keep
   working exactly as before.
════════════════════════════════════════════════════════════ */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches; // desktop-only cursor effects
const snap = { type: 'spring', stiffness: 300, damping: 20, mass: 0.5 };

function clearTransform(el) {
  el.style.transform = '';
}

/* ── Magnetic pull: CTA gets drawn toward the cursor, springs back on leave ── */
function magnetic(el, strength = 0.35) {
  if (!el || reduced || !fine) return;

  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    animate(el, { transform: `translate(${x}px, ${y}px)` }, snap);
  });

  el.addEventListener('mouseleave', () => {
    animate(el, { transform: 'translate(0px, 0px)' }, snap).finished.then(() => clearTransform(el));
  });
}

document.querySelectorAll('.nav-cta, .si-cta, .contact-card-action').forEach((el) => magnetic(el, 0.3));

/* ── Card tilt: subtle 3D depth that tracks the cursor ── */
function tilt(el, max = 6) {
  if (!el || reduced || !fine) return;

  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    animate(
      el,
      { transform: `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(4px)` },
      snap
    );
  });

  el.addEventListener('mouseleave', () => {
    animate(el, { transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)' }, snap)
      .finished.then(() => clearTransform(el));
  });
}

document.querySelectorAll('.service-item-inner, .contact-card, .contact-map-wrap').forEach((el) => tilt(el, 5));

/* ── Mobile menu: links spring in with a stagger each time the panel opens ── */
const mobileMenu = document.getElementById('mobileMenu');
const hamburger = document.getElementById('hamburger');
const mobileItems = document.querySelectorAll('.mobile-link, .mobile-cta-link, .mobile-wa-link');

function playMobileMenuIn() {
  if (reduced || !mobileItems.length) return;
  animate(
    mobileItems,
    { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
    { delay: stagger(0.05), duration: 0.45, easing: [0.16, 1, 0.3, 1] }
  ).finished.then(() => mobileItems.forEach(clearTransform));
}

hamburger?.addEventListener('click', () => requestAnimationFrame(playMobileMenuIn));

/* ── WhatsApp float: springs in once on load, then a slow idle breathe.
     Idle loop pauses (and clears its transform) on hover so the existing
     CSS :hover scale keeps working untouched. ── */
const waFloat = document.querySelector('.whatsapp-float');
let waIdle = null;

function startWaIdle() {
  if (reduced || waIdle) return;
  waIdle = animate(waFloat, { transform: ['scale(1)', 'scale(1.045)', 'scale(1)'] }, { duration: 2.6, repeat: Infinity, easing: 'ease-in-out' });
}

if (waFloat) {
  if (reduced) {
    waFloat.style.opacity = 1;
  } else {
    animate(waFloat, { transform: ['scale(0)', 'scale(1.12)', 'scale(1)'], opacity: [0, 1, 1] }, { duration: 0.7, delay: 0.4, easing: [0.34, 1.56, 0.64, 1] })
      .finished.then(() => {
        clearTransform(waFloat);
        startWaIdle();
      });

    waFloat.addEventListener('mouseenter', () => {
      waIdle?.stop();
      waIdle = null;
      clearTransform(waFloat);
    });
    waFloat.addEventListener('mouseleave', startWaIdle);
  }
}
