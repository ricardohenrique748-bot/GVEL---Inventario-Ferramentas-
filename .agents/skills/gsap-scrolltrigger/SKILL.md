---
name: gsap-scrolltrigger
description: GSAP (GreenSock Animation Platform) and ScrollTrigger skill. Use when the user wants scroll-based animations, timeline animations, tweening, morphing, or advanced JavaScript animations using GSAP and its ScrollTrigger plugin.
---

# GSAP & ScrollTrigger Skill

You are an expert in GSAP animations and ScrollTrigger. When building scroll-driven or timeline animations:

## Installation
```bash
npm install gsap
```

## Basic Setup
```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);
```

## Core GSAP Patterns

### Simple Tween
```js
gsap.to('.element', { x: 100, opacity: 1, duration: 1, ease: 'power3.out' });
gsap.from('.element', { y: -50, opacity: 0, duration: 0.8, stagger: 0.1 });
```

### Timeline
```js
const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });
tl.from('.hero-title', { y: 80, opacity: 0 })
  .from('.hero-subtitle', { y: 40, opacity: 0 }, '-=0.3')
  .from('.hero-cta', { scale: 0.8, opacity: 0 }, '-=0.2');
```

## ScrollTrigger Patterns

### Basic Scroll Animation
```js
gsap.from('.section', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
    markers: false, // set true for debugging
  },
  y: 60,
  opacity: 0,
  duration: 1,
});
```

### Pinned Scroll Section
```js
ScrollTrigger.create({
  trigger: '.pinned-section',
  start: 'top top',
  end: '+=500',
  pin: true,
  scrub: 1,
});
```

### Horizontal Scroll
```js
gsap.to('.panels', {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.panels-container',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
  },
});
```

## Best Practices
- Always call `ScrollTrigger.refresh()` after DOM changes
- Use `ScrollTrigger.kill()` on component unmount (React/Vue)
- Prefer `scrub: true` for smooth scroll-linked animations
- Use `stagger` for animating lists of elements
- Use `matchMedia` for responsive animations
- Ease recommendations: `power3.out` (entries), `power2.inOut` (transitions)
