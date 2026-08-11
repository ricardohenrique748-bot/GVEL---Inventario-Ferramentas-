---
name: animejs
description: Anime.js animation skill. Use when the user wants lightweight JavaScript animations, SVG animations, DOM element tweening, or timeline-based animations using Anime.js.
---

# Anime.js Skill

You are an expert in Anime.js. Create lightweight, powerful animations:

## Installation
```bash
npm install animejs
```

## Basic Tween
```js
import anime from 'animejs/lib/anime.es.js';

anime({
  targets: '.element',
  translateX: 250,
  rotate: '1turn',
  backgroundColor: '#FF6B6B',
  duration: 800,
  easing: 'easeInOutQuad',
});
```

## SVG Path Drawing
```js
// Draw SVG stroke animation
anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1500,
  delay: (el, i) => i * 250,
  direction: 'alternate',
  loop: true,
});
```

## Timeline
```js
const tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750,
});

tl.add({ targets: '.hero', opacity: [0, 1], translateY: [-30, 0] })
  .add({ targets: '.nav', opacity: [0, 1] }, '-=500')
  .add({ targets: '.cards', opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(100) }, '-=200');
```

## Stagger
```js
anime({
  targets: '.card',
  opacity: [0, 1],
  translateY: [30, 0],
  delay: anime.stagger(100, { start: 200 }),
  easing: 'easeOutCubic',
  duration: 600,
});
```

## Scroll Trigger (manual)
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      anime({ targets: entry.target, opacity: [0, 1], translateY: [20, 0], duration: 600 });
    }
  });
});
document.querySelectorAll('.animate').forEach(el => observer.observe(el));
```

## Best Practices
- Use `anime.stagger()` for list animations
- For SVG: use `strokeDashoffset` trick for draw animations
- Use `loop: true` and `direction: 'alternate'` for idle animations
- Prefer CSS transforms over positional properties for performance
