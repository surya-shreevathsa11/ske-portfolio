import { gsap } from 'gsap';

const WIRE_LEN = 1272;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initCircuit(onComplete) {
  const paths = [...document.querySelectorAll('.c-path')];
  const sparks = [...document.querySelectorAll('.c-spark:not(.c-spark-trail)')];
  const trails = [...document.querySelectorAll('.c-spark-trail')];
  const circuit = document.getElementById('heroCircuit');

  if (!paths.length || !circuit) return;

  if (REDUCED) {
    gsap.set(paths, { strokeDashoffset: 0 });
    gsap.set([...sparks, ...trails], { opacity: 0 });
    circuit.classList.add('is-live');
    onComplete?.();
    return;
  }

  paths.forEach((el) => {
    const len = el.getTotalLength ? el.getTotalLength() : 0;
    if (len > 0) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set([...sparks, ...trails], { opacity: 0 });

  const drawTl = gsap.timeline({
    onComplete: () => {
      circuit.classList.add('is-live');
      surgePulse(circuit);
      startSparks(sparks, trails);
      startWireFlow();
      startFeederPulse();
      startLoadPulse();
      startContactGlow();
      startBreathing(circuit);
      startPeriodicSurge(circuit);
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

function surgePulse(circuit) {
  const loads = [...document.querySelectorAll('.c-load')];
  const loadData = loads.map((el) => ({
    el,
    r: parseFloat(el.getAttribute('r') || '16'),
    stroke: el.getAttribute('stroke') || '#F0EBE0',
  }));

  circuit.classList.add('is-surging');

  const tl = gsap.timeline({
    onComplete: () => circuit.classList.remove('is-surging'),
  });

  tl.to(circuit, { opacity: 0.5, duration: 0.07, ease: 'power4.in' }, 0)
    .to(circuit, { opacity: 0.16, duration: 0.65, ease: 'power3.out' }, 0.07);

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

function startSparks(sparks, trails) {
  const DASH = 64;
  const GAP = WIRE_LEN;
  const SPEEDS = [2.8, 3.4, 2.4];

  sparks.forEach((spark, i) => {
    const total = DASH + GAP;
    gsap.set(spark, {
      strokeDasharray: `${DASH} ${GAP + DASH}`,
      strokeDashoffset: total,
      stroke: '#E8A86A',
      opacity: 0.9,
    });
    gsap.to(spark, {
      strokeDashoffset: 0,
      duration: SPEEDS[i],
      ease: 'none',
      repeat: -1,
      delay: i * 0.55,
    });
  });

  trails.forEach((trail, i) => {
    const DASH_T = 28;
    const total = DASH_T + GAP;
    gsap.set(trail, {
      strokeDasharray: `${DASH_T} ${GAP + DASH_T}`,
      strokeDashoffset: total,
      opacity: 0.35,
    });
    gsap.to(trail, {
      strokeDashoffset: 0,
      duration: SPEEDS[i] * 1.2,
      ease: 'none',
      repeat: -1,
      delay: i * 0.55 + 0.4,
    });
  });
}

function startWireFlow() {
  const branches = [...document.querySelectorAll('.c-branch')];
  const mains = document.querySelector('.c-mains');

  branches.forEach((wire, i) => {
    gsap.set(wire, { strokeDasharray: '6 18', strokeDashoffset: 0 });
    gsap.to(wire, {
      strokeDashoffset: -48,
      duration: 2.2 + i * 0.3,
      ease: 'none',
      repeat: -1,
      delay: i * 0.4,
    });
  });

  if (mains) {
    gsap.set(mains, { strokeDasharray: '4 10', strokeDashoffset: 0 });
    gsap.to(mains, {
      strokeDashoffset: -28,
      duration: 1.4,
      ease: 'none',
      repeat: -1,
    });
  }
}

function startFeederPulse() {
  const feeder = document.querySelector('.c-feeder');
  if (!feeder) return;

  const len = feeder.getTotalLength();
  gsap.set(feeder, { strokeDasharray: `${len}`, strokeDashoffset: len });

  gsap.to(feeder, {
    strokeDashoffset: 0,
    duration: 2.8,
    ease: 'none',
    repeat: -1,
    repeatDelay: 0.6,
  });
}

function startLoadPulse() {
  const loads = [...document.querySelectorAll('.c-load')];
  const byBranch = [[], [], []];

  loads.forEach((el) => {
    const y = parseFloat(el.getAttribute('cy') || '0');
    if (y < 300) byBranch[0].push(el);
    else if (y < 550) byBranch[1].push(el);
    else byBranch[2].push(el);
  });

  byBranch.forEach((group, branchIdx) => {
    group.sort((a, b) =>
      parseFloat(a.getAttribute('cx')) - parseFloat(b.getAttribute('cx'))
    );

    group.forEach((load, i) => {
      const r = parseFloat(load.getAttribute('r') || '16');
      const cycle = group.length * 0.7;

      gsap.to(load, {
        attr: { r: r * 1.18 },
        stroke: '#E8A86A',
        duration: 0.35,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        repeatDelay: cycle - 0.7,
        delay: branchIdx * 0.9 + i * 0.7,
      });
    });
  });
}

function startContactGlow() {
  const contacts = [...document.querySelectorAll('.c-contact')];

  contacts.forEach((contact, i) => {
    gsap.to(contact, {
      stroke: '#E8A86A',
      opacity: 0.95,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: (i % 6) * 0.15,
      repeatDelay: 2.4 + (i % 4) * 0.3,
    });
  });
}

function startBreathing(circuit) {
  gsap.to(circuit, {
    opacity: 0.22,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

function startPeriodicSurge(circuit) {
  const loads = [...document.querySelectorAll('.c-load')];

  gsap.timeline({ repeat: -1, repeatDelay: 9 })
    .call(() => {
      circuit.classList.add('is-surging');
      gsap.to(circuit, {
        opacity: 0.28,
        duration: 0.15,
        ease: 'sine.in',
        yoyo: true,
        repeat: 1,
        onComplete: () => circuit.classList.remove('is-surging'),
      });
      loads.forEach((load, i) => {
        const r = parseFloat(load.getAttribute('r') || '16');
        gsap.fromTo(load,
          { attr: { r }, stroke: '#F0EBE0' },
          {
            attr: { r: r * 1.12 },
            stroke: '#E8A86A',
            duration: 0.2,
            ease: 'sine.out',
            yoyo: true,
            repeat: 1,
            delay: i * 0.05,
          }
        );
      });
    });
}
