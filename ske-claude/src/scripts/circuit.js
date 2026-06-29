import { gsap } from 'gsap';

const WIRE_LEN = 1272; // branch wire pixel length (1380 - 108)

export function initCircuit(onComplete) {
  const paths = [...document.querySelectorAll('.c-path')];
  const sparks = [...document.querySelectorAll('.c-spark')];
  const circuit = document.getElementById('heroCircuit');

  if (!paths.length) return;

  // Pre-hide all paths via stroke-dashoffset
  paths.forEach((el) => {
    const len = el.getTotalLength ? el.getTotalLength() : 0;
    if (len > 0) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set(sparks, { opacity: 0 });

  // ── Phase 1: Draw paths from left to right ─────────────
  const drawTl = gsap.timeline({
    onComplete: () => {
      surgePulse(circuit);
      startSparks(sparks);
      startBreathing(circuit);
      onComplete?.();
    },
  });

  drawTl.to(paths, {
    strokeDashoffset: 0,
    duration: 0.5,
    stagger: { amount: 1.6, from: 'start', ease: 'power1.in' },
    ease: 'power2.out',
  });
}

// ── Phase 2: Power surge — circuit briefly brightens ───────
function surgePulse(circuit) {
  gsap.timeline()
    .to(circuit, { opacity: 0.42, duration: 0.12, ease: 'power4.in' })
    .to(circuit, { opacity: 0.12, duration: 0.45, ease: 'power3.out' });
}

// ── Phase 3: Sparks travel along branch wires ──────────────
function startSparks(sparks) {
  const DASH   = 38;        // visible dash length in px
  const GAP    = WIRE_LEN;  // total gap (≈ entire wire length)
  const SPEEDS = [2.0, 2.6, 1.7]; // different speeds per branch

  sparks.forEach((spark, i) => {
    const total = DASH + GAP;
    gsap.set(spark, {
      strokeDasharray: `${DASH} ${GAP + DASH}`,
      strokeDashoffset: total,
      stroke: '#B87C4C',
      opacity: 0.9,
    });
    gsap.to(spark, {
      strokeDashoffset: 0,
      duration: SPEEDS[i],
      ease: 'none',
      repeat: -1,
      delay: i * 0.55 + 0.15,
    });
  });
}

// ── Phase 4: Ambient circuit breathing ─────────────────────
function startBreathing(circuit) {
  circuit.classList.add('is-breathing');
}
