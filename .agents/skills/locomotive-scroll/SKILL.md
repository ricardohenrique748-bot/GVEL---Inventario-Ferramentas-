---
name: locomotive-scroll
description: Locomotive Scroll smooth scrolling skill. Use when the user wants smooth scrolling, parallax effects, scroll-based reveals, or custom scroll behavior using Locomotive Scroll.
---

# Locomotive Scroll Skill

You are an expert in Locomotive Scroll. Create silky-smooth scrolling experiences:

## Installation
```bash
npm install locomotive-scroll
```

## Basic Setup
```js
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  multiplier: 1,
  class: 'is-inview',
  lerp: 0.1, // smoothness (0 = instant, 1 = very smooth)
});
```

## HTML Attributes
```html
<div data-scroll-container>
  <section data-scroll-section>
    <h1 data-scroll data-scroll-speed="2">Fast title</h1>
    <p data-scroll data-scroll-speed="-1">Slow paragraph (parallax)</p>
    <div data-scroll data-scroll-class="is-visible" data-scroll-repeat="true">
      Triggers class on enter
    </div>
  </section>
</div>
```

## Events
```js
scroll.on('scroll', ({ scroll }) => {
  console.log(scroll.y); // current scroll position
});

scroll.on('call', (value, way, obj) => {
  // triggered when data-scroll-call attribute element enters/exits
});
```

## With GSAP ScrollTrigger
```js
import { ScrollTrigger } from 'gsap/ScrollTrigger';

scroll.on('scroll', ScrollTrigger.update);
ScrollTrigger.scrollerProxy('[data-scroll-container]', {
  scrollTop(value) {
    return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
});
```

## Best Practices
- Always call `scroll.destroy()` on component unmount
- Call `scroll.update()` after DOM changes
- Use `lerp: 0.07` to `0.12` for a premium feel
- Combine with GSAP for scroll-triggered animations
