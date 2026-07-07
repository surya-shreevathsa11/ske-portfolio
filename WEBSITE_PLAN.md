# Sri Kaveri Electricals — Website Plan

---

## Overview

A premium portfolio website for **Sri Kaveri Electricals** — a professional electrical services firm. The website's sole purpose is to communicate expertise, build trust, and drive users toward a direct contact action (WhatsApp or call). No e-commerce, no backend, no login. Pure frontend, zero gradients.

**Domain of business:** Electrical design and implementation for residential and commercial buildings.  
**Target user action:** Understand the services → Contact via WhatsApp or phone call.

---

## Brand Identity

### Name
Sri Kaveri Electricals *(abbreviated: SKE)*

### Colour Palette

| Role | Name | Hex |
|---|---|---|
| Primary Background (dark) | Deep Navy | `#091320` |
| Secondary Background (dark) | Navy | `#0D1B2A` |
| Primary Background (light) | Ivory | `#F0EBE0` |
| Near White | Warm White | `#FAFAF7` |
| Body Text on Dark | Muted Ivory | `#BDB5A8` |
| Accent Line / Borders | Warm Ivory Border | `#2A3A4A` |
| Optional Tertiary (use sparingly) | Copper | `#B87C4C` |

> No gradients. No glassmorphism. Flat colour blocks only.  
> Dark sections use Deep Navy or Navy. Light sections use Ivory or Warm White.  
> The copper accent is optional — use only for thin decorative lines or active states if needed.

### Typography

**Primary Font:** Neue Haas Grotesk  
**Delivery:** Via Adobe Fonts or self-hosted woff2 files (to be confirmed)  
**Fallback stack:** `"Neue Haas Grotesk", "Helvetica Neue", system-ui, -apple-system, sans-serif`

| Usage | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|
| Hero Headline | 700 (Bold) | 88–100px | 48–56px |
| Section Headline | 600 (Medium) | 52–64px | 36–42px |
| Sub-heading | 500 | 24–28px | 20–22px |
| Body Text | 400 (Regular) | 17px | 16px |
| Labels / Caps | 500, letter-spacing 0.12em | 12–13px | 12px |
| Navigation | 400 | 15px | 15px |

Letter-spacing on headings: `-0.02em` to `-0.03em` (tight, premium feel).  
Line-height on headings: `1.0–1.1`.  
Line-height on body: `1.7`.

---

## Section Structure

### 1. Navigation

**Style:** Minimal top bar, full-width, sticky on scroll.

**Layout:**
```
[SKE logotype — left]          [Services  Process  Portfolio  Contact — center/right]   [Get In Touch — CTA button — right]
```

**Behaviour:**
- On load: transparent background, ivory text.
- On scroll (past 80px): background transitions to `#091320` (no jump — CSS `transition: background 0.4s ease`).
- Active section: corresponding nav link gets a 1px underline from the left.
- Mobile: hamburger menu. On open, full-screen navy overlay with nav links stacked vertically, large.

**CTA Button:** Small outlined button (1px border, ivory). On hover: fill becomes ivory, text becomes navy. Transition: `0.25s`.

---

### 2. Hero Section

**Background:** `#091320` (Deep Navy), full viewport height (`100vh`).

**Visual concept:** Bold typographic statement over an animated SVG electrical circuit trace. The circuit lines are not decorative noise — they form a minimal, precise schematic-like pattern (horizontal and vertical runs, with junction nodes). They animate themselves into existence on page load.

**Layout (centered):**
```
                     [small label — uppercase, tracked]
                     ELECTRICAL SERVICES · COIMBATORE

          [Main Headline — 3 lines, very large, ivory]
          Precision
          Electrical
          Works.

          [Sub-line — muted ivory, 17px]
          From design to implementation — we handle
          every wire, every circuit, every connection.

          [Two CTAs side by side]
          [WhatsApp Us →]        [View Services]

     [Scroll indicator — thin vertical line that pulses downward]
```

**Background element:** An SVG layer (absolutely positioned, full hero coverage, opacity 0.12–0.15) containing:
- Horizontal and vertical paths that form a circuit-board-like grid
- Junction nodes (small circles at path intersections)
- These paths animate using `stroke-dashoffset` on load — tracing themselves from left to right / top to bottom over ~2.5 seconds with staggered delays

**Hero Animations (load sequence):**
1. `0ms` — Circuit SVG paths begin tracing (stroke-dashoffset: full → 0)
2. `400ms` — "ELECTRICAL SERVICES · COIMBATORE" label slides up from a clip-path mask
3. `700ms` — "Precision" slides up from mask
4. `900ms` — "Electrical" slides up from mask
5. `1100ms` — "Works." slides up from mask
6. `1400ms` — Sub-line fades in (translate Y: 12px → 0)
7. `1600ms` — CTA buttons fade in with slight upward movement
8. `2000ms` — Scroll indicator appears and begins its loop animation

> Each headline word uses a clip-path reveal (`inset(0 0 100% 0)` → `inset(0 0 0% 0)`) — it looks like words are being *lifted into view* from behind a floor, not just fading in.

---

### 3. Services Section

**Background:** Ivory (`#F0EBE0`)  
**Heading:** "What We Do" — large, navy, left-aligned  
**Label above heading:** `SERVICES` — uppercase, 12px, copper or navy muted

**Three Services — full-width stacked panels (not cards):**

Each service is a large horizontal panel with:
- Left: large index number (01, 02, 03) in very light navy (opacity 0.08), absolutely positioned, decorative
- Center-left: service name (large, bold) + one-line description below
- Right: a minimal line-icon representing the service (custom SVG, not filled, just strokes)

---

**Service 01 — Electrical Design**
> *We create complete, code-compliant electrical layouts for residential and commercial buildings — from load calculations to circuit schematics.*

Icon concept: An architectural floor plan with circuit overlay marks

**Service 02 — Design & Implementation**
> *We design and fully execute the electrical system — one team, end to end. From the plan on paper to every fitted socket and breaker.*

Icon concept: A blueprint page and a connected node

**Service 03 — Third-Party Implementation**
> *Working from your approved drawings? We take any qualified electrical design and execute it precisely — no redesign needed.*

Icon concept: A document being handed off with an arrow/relay mark

---

**Services Section Animations:**
- Panel enters on scroll: `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` (left-to-right wipe reveal)
- Icon strokes animate (stroke-dashoffset) when the panel is in view
- On hover over a panel: the left border grows from 0px height to 100% (top → down), ivory border becomes a copper 3px bar
- Large index number (01 etc.) fades in slightly after the panel wipes in

---

### 4. About Section

**Background:** Navy (`#0D1B2A`)  
**Colour shift:** Going from ivory (services) to navy here creates a clear visual rhythm.

**Layout:** Two-column

```
[Left column]                     [Right column]
About Sri Kaveri                  Body text — 3–4 sentences about
Electricals.                      the firm. Who they are, where
                                  they operate, their ethos.

                                  [A thin horizontal rule — ivory,
                                  1px — that grows from left to
                                  right on scroll]

                                  [Two or three short value
                                  statements below the rule]
                                  · Safety First
                                  · Built to Code
                                  · Honest Execution
```

**Content to fill in:**
- Company background (founding year, city)
- Any relevant certifications or registration (if applicable)

**Animations:**
- Headline: word-by-word clip-path reveal (same technique as hero, but triggered on scroll)
- Horizontal rule: `width: 0` → `width: 100%` on scroll trigger, `transition: 1.2s ease`
- Value statements stagger in below the rule with 100ms delay each

---

### 5. Process Section

**Background:** Ivory (`#F0EBE0`)  
**Label:** `HOW WE WORK`  
**Heading:** "Our Process" — navy, large

**Four steps, displayed as a vertical numbered list (left-aligned):**

```
01 ——————————————————
   Understand the Scope
   We begin with a site visit or detailed brief to understand
   the scale, requirements, and existing conditions.

   [connector line, animated]

02 ——————————————————
   Design the System
   [if applicable — for Service 01 or 02]
   Our team drafts a complete electrical layout — load
   schedules, circuit drawings, and panel specifications.

03 ——————————————————
   Approve & Plan
   Once the design is confirmed (ours or yours), we plan
   the implementation phase, sourcing and scheduling.

04 ——————————————————
   Execute & Hand Over
   We complete the installation to specification and hand
   over documentation with a full walkthrough.
```

> Step 03 content can subtly note "for third-party implementations, this phase begins here."

**Animations:**
- The vertical connector line between steps literally draws itself as you scroll (SVG path with dashoffset)
- Step number and heading reveal together via clip-path
- Description text fades in 200ms after the heading appears
- Each step triggers when 60% of the viewport height is crossed

---

### 6. Portfolio Section

**Background:** Deep Navy (`#091320`)  
**Label:** `OUR WORK`  
**Heading:** "Projects" — ivory

> **Note:** No project photos available at launch. Structure is designed and ready — images and project details to be added later.

**Layout:** A 2-column grid of project cards (switches to 1 column on mobile)

Each card contains:
- A placeholder area (aspect ratio 4:3) — on launch, this shows a placeholder with the project category name
- Project name (below image)
- Location / Type label
- Year

**On launch placeholder treatment:** Each empty image area gets a navy fill with a minimal circuit node SVG pattern, and the project category text centered. It looks intentional, not broken.

**Animations:**
- Cards enter with a `translateY(30px)` → `translateY(0)` + `opacity 0` → `1`, staggered 120ms per card
- On hover: image scales to `1.04` with `overflow: hidden` on the card container (creates a clean zoom inside frame)
- Card border (1px, `#2A3A4A`) appears on hover with a clockwise trace animation

---

### 7. Contact Section

**Background:** Ivory (`#F0EBE0`)  
**Label:** `GET IN TOUCH`  
**Heading:** "Let's Talk." — large, navy

**Layout:** Two-column

```
[Left column]                        [Right column]
Contact Details                      Google Maps embed

WhatsApp                             [Embedded map — styled
[+91 XXXXXXXXXX — large, bold]       to greyscale or navy tint,
[WhatsApp Us →] ← primary CTA        no coloured Google branding]

Call Us
[+91 XXXXXXXXXX]
[Call Now →]

Address
[Full address here]
[Directions →] — opens Google Maps
```

**WhatsApp CTA button:** Filled navy, ivory text, no border. On hover: ivory background, navy text. No gradient, no shadow. Clean inversion.

**Subtle animation on WhatsApp button:** A slow, repeating `box-shadow` pulse on a 2.5s loop — like a gentle heartbeat. This draws attention without being obnoxious.

**Google Maps embed:** 
- Full-height iframe on the right column
- CSS filter: `grayscale(1)` — removes Google's colour branding, matches the navy/ivory palette
- On hover: filter transitions to `grayscale(0.4)` — subtle reveal of colour

**Contact form:** Not included at this stage. Contact is entirely through WhatsApp and phone.

---

### 8. Footer

**Background:** Deep Navy (`#091320`)  
**Layout:** Three-column

```
[Col 1]                  [Col 2]                [Col 3]
SKE                      Services               Contact
Sri Kaveri               Electrical Design      +91 XXXXXXXXXX
Electricals              Design & Impl.         [WhatsApp]
Coimbatore, TN           Third-Party Impl.
                         Process

[Bottom bar — full width, 1px top border in #2A3A4A]
© 2025 Sri Kaveri Electricals. All rights reserved.
```

**Footer Animations:**
- Columns reveal with staggered `translateY(20px)` → `0` on scroll
- Bottom bar slides in from left (`width: 0` → `100%`) after columns appear

---

## Animation Philosophy

All animations follow three rules:
1. **Motion implies meaning** — things move because they're entering, activating, or responding. Not for decoration.
2. **Clip-path reveals over fades** — elements wipe into existence (top, bottom, or side depending on context) rather than simply fading in. This feels physical and premium.
3. **No spring bounces** — `ease` or `cubic-bezier(0.22, 1, 0.36, 1)` curves only. Sharp ease-out. No elastic overshoot.

### Animation Reference Table

| Element | Trigger | Technique | Duration |
|---|---|---|---|
| Hero headline words | Page load | `clip-path inset` bottom wipe, staggered | 600ms per word |
| SVG circuit traces | Page load | `stroke-dashoffset` draw | 2500ms total |
| Section headings | Scroll enter | `clip-path inset` bottom wipe | 700ms |
| Service panels | Scroll enter | `clip-path inset` right-to-left wipe | 800ms |
| Service icons | Scroll enter | `stroke-dashoffset` draw | 1000ms |
| Service hover border | Hover | Pseudo-element `height: 0 → 100%` on left edge | 300ms |
| About rule line | Scroll enter | `width: 0 → 100%` | 1200ms |
| Process connector line | Scroll | `stroke-dashoffset` continuous draw | Per step |
| Portfolio cards | Scroll enter | `translateY(30px) + opacity` stagger | 400ms, 120ms stagger |
| Portfolio card hover | Hover | `scale(1.04)` on inner image | 400ms |
| WhatsApp button pulse | Idle loop | `box-shadow` keyframe animation | 2500ms loop |
| Maps greyscale reveal | Hover | `filter: grayscale(1 → 0.4)` | 600ms |
| Nav background | Scroll past hero | `background opacity: 0 → 1` | 400ms |
| Footer columns | Scroll enter | `translateY(20px) + opacity`, staggered | 500ms, 150ms stagger |

---

## Page Layout Flow (Visual Rhythm)

```
[DARK]   Navigation (transparent → deep navy on scroll)
[DARK]   Hero — Deep Navy
[LIGHT]  Services — Ivory
[DARK]   About — Navy
[LIGHT]  Process — Ivory
[DARK]   Portfolio — Deep Navy
[LIGHT]  Contact — Ivory
[DARK]   Footer — Deep Navy
```

The alternating dark/light rhythm creates visual breathing room and makes each section feel distinct without needing borders or dividers.

---

## Technical Recommendations

- **Framework:** Plain HTML + CSS + Vanilla JS (no framework needed for a site this size)
  - OR: Next.js / Astro if SSG/SEO performance matters
- **Animation library:** GSAP (GreenSock) — for the scroll-triggered and SVG path animations. Use `ScrollTrigger` plugin.
- **Alternative (lightweight):** CSS custom properties + Intersection Observer API for simple reveals; GSAP only where needed
- **Maps:** Google Maps Embed API (iframe, with `grayscale(1)` CSS filter applied)
- **WhatsApp link format:** `https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20wanted%20to%20enquire%20about%20your%20services.`
- **Performance:** All fonts self-hosted as woff2. SVG animations use `will-change: stroke-dashoffset` to GPU-accelerate.
- **Mobile-first breakpoints:** 375px (mobile), 768px (tablet), 1280px (desktop), 1600px (large desktop)
- **SEO:** Meta title, description, OG tags, structured data (LocalBusiness schema for the map/contact)

---

## Content Placeholders (to be filled before build)

| Placeholder | Required for |
|---|---|
| WhatsApp number | Contact section, hero CTA, footer |
| Phone number | Contact section, footer |
| Full address | Contact section, footer |
| Google Maps embed URL / Place ID | Contact section |
| Company founding year (if to be mentioned) | About section |
| 3–4 sentence company description | About section |
| Project names + types (when photos available) | Portfolio section |
| Any certifications / license numbers | About section (optional) |

---

## What This Website Is Not

- Not an e-commerce site (no product listings, no cart, no checkout)
- Not a content site (no blog, no news section)
- Not a client portal (no login, no dashboard)
- Not form-driven (no contact form, no quote calculator)

The website is a **digital business card and portfolio** — beautiful, fast, and direct.

---

*Plan version: 1.0 — June 2026*
