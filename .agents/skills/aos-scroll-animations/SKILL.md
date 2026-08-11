---
name: aos-scroll-animations
description: AOS (Animate On Scroll) skill. Use when the user wants simple scroll-triggered animations like fade-in, slide-in, zoom on scroll using the AOS library with minimal setup.
---

# AOS (Animate On Scroll) Skill

You are an expert in AOS. Add scroll animations with minimal code:

## Installation
```bash
npm install aos
```

## Setup
```js
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 800,      // animation duration in ms
  easing: 'ease-out-cubic',
  once: false,        // animate every time element enters viewport
  mirror: false,      // animate out on scroll up
  offset: 100,        // offset trigger in px from bottom of viewport
  delay: 0,
  anchorPlacement: 'top-bottom',
});
```

## HTML Attributes
```html
<!-- Basic -->
<div data-aos="fade-up">Content</div>
<div data-aos="fade-right" data-aos-delay="200">Content</div>
<div data-aos="zoom-in" data-aos-duration="600">Content</div>

<!-- With config overrides -->
<div
  data-aos="slide-left"
  data-aos-offset="300"
  data-aos-easing="ease-in-sine"
  data-aos-duration="1000"
  data-aos-delay="100"
  data-aos-once="true"
>
  Content
</div>
```

## Available Animations
**Fade**: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-right`, `fade-up-left`
**Flip**: `flip-left`, `flip-right`, `flip-up`, `flip-down`
**Slide**: `slide-up`, `slide-down`, `slide-left`, `slide-right`
**Zoom**: `zoom-in`, `zoom-in-up`, `zoom-out`, `zoom-out-up`

## React Usage
```jsx
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return <div data-aos="fade-up">Animated content</div>;
}
```

## Best Practices
- Call `AOS.refresh()` after dynamically adding elements
- Use `once: true` for performance in production
- Set `easing: 'ease-out-cubic'` for premium feel
- Stagger items using `data-aos-delay` increments of 100ms
