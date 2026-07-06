import { gsap } from 'gsap';

const WIRE_LEN = 1272; // branch wire pixel length (1380 - 108)

export function initCircuit(onComplete) {
  const paths = [...document.querySelectorAll('.c-path')];
  const sparks = [...document.querySelectorAll('.c-spark:not(.c-spark-trail)')];
  const trails = [...document.querySelectorAll('.c-spark-trail')];
  const circuit = document.getElementById('heroCircuit');

  if (!paths.length) return;

  // Pre-hide all paths via stroke-dashoffset
  paths.forEach((el) => {
    const len = el.getTotalLength ? el.getTotalLength() : 0;
    if (len > 0) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set([...sparks, ...trails], { opacity: 0 });

  // ── Phase 1: Draw paths from left to right ─────────────
  const drawTl = gsap.timeline({
    onComplete: () => {
      surgePulse(circuit);
      startSparks(sparks, trails);
      startBreathing(circuit);
      onComplete?.();
    },
  });

  drawTl.to(paths, {
    strokeDashoffset: 0,
    duration: 0.45,
    stagger: { amount: 1.4, from: 'start', ease: 'power1.in' },
    ease: 'power3.out',
  });
}

// ── Phase 2: Power surge — circuit brightens, loads flicker ─
function surgePulse(circuit) {
  const loads = [...document.querySelectorAll('.hero-circuit circle.c-path:not(.c-contact)')];
  const loadData = loads.map((el) => ({
    el,
    r: parseFloat(el.getAttribute('r') || '16'),
    stroke: el.getAttribute('stroke') || '',
  }));

  circuit.classList.add('is-surging');

  const tl = gsap.timeline({
    onComplete: () => circuit.classList.remove('is-surging'),
  });

  tl.to(circuit, { opacity: 0.58, duration: 0.07, ease: 'power4.in' }, 0)
    .to(circuit, { opacity: 0.12, duration: 0.65, ease: 'power3.out' }, 0.07);

  loadData.forEach(({ el, r }, i) => {
    tl.to(el, {
      attr: { r: r * 1.45 },
      stroke: '#E8A86A',
      duration: 0.12,
      ease: 'power2.out',
    }, 0.02 + i * 0.025);
    tl.to(el, {
      attr: { r },
      stroke: '#F0EBE0',
      duration: 0.35,
      ease: 'power3.out',
    }, 0.18 + i * 0.02);
  });
}

// ── Phase 3: Sparks + trailing ghosts along branch wires ───
function startSparks(sparks, trails) {
  const DASH   = 52;
  const GAP    = WIRE_LEN;
  const SPEEDS = [1.6, 2.1, 1.4];

  sparks.forEach((spark, i) => {
    const total = DASH + GAP;
    gsap.set(spark, {
      strokeDasharray: `${DASH} ${GAP + DASH}`,
      strokeDashoffset: total,
      stroke: '#E8A86A',
      opacity: 1,
    });
    gsap.to(spark, {
      strokeDashoffset: 0,
      duration: SPEEDS[i],
      ease: 'none',
      repeat: -1,
      delay: i * 0.4,
    });
  });

  trails.forEach((trail, i) => {
    const DASH_T = 22;
    const total = DASH_T + GAP;
    gsap.set(trail, {
      strokeDasharray: `${DASH_T} ${GAP + DASH_T}`,
      strokeDashoffset: total,
      opacity: 0.45,
    });
    gsap.to(trail, {
      strokeDashoffset: 0,
      duration: SPEEDS[i] * 1.35,
      ease: 'none',
      repeat: -1,
      delay: i * 0.4 + 0.35,
    });
  });
}

// ── Phase 4: Ambient circuit breathing ─────────────────────
function startBreathing(circuit) {
  circuit.classList.add('is-breathing');
}
