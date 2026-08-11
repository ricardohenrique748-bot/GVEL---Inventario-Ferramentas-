---
name: barbajs-transitions
description: Barba.js page transitions skill. Use when the user wants smooth, animated page transitions between pages in multi-page websites using Barba.js.
---

# Barba.js Page Transitions Skill

You are an expert in Barba.js. Create seamless animated page transitions:

## Installation
```bash
npm install @barba/core @barba/css
```

## Basic Setup
```js
import barba from '@barba/core';
import { gsap } from 'gsap';

barba.init({
  transitions: [
    {
      name: 'fade-transition',
      async leave(data) {
        await gsap.to(data.current.container, { opacity: 0, duration: 0.4 });
      },
      async enter(data) {
        gsap.from(data.next.container, { opacity: 0, duration: 0.4 });
      },
    },
  ],
});
```

## HTML Structure
```html
<div id="barba-wrapper">
  <div data-barba="container" data-barba-namespace="home">
    <!-- page content -->
  </div>
</div>
```

## Slide Transition
```js
{
  name: 'slide-left',
  async leave({ current }) {
    await gsap.to(current.container, { x: '-100%', duration: 0.5, ease: 'power2.in' });
  },
  async enter({ next }) {
    gsap.from(next.container, { x: '100%', duration: 0.5, ease: 'power2.out' });
  },
}
```

## Hooks Available
- `beforeLeave`, `leave`, `afterLeave`
- `beforeEnter`, `enter`, `afterEnter`
- `once` (first page load)

## Best Practices
- Re-init any scroll or animation libraries after page transitions
- Use `barba.hooks.after()` to refresh GSAP ScrollTrigger
- Target specific transitions with `from` and `to` namespace selectors
