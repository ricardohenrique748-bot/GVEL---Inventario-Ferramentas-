---
name: integration-patterns-3d
description: 3D and animation integration patterns skill. Use when the user wants to combine multiple 3D or animation libraries together (e.g. Three.js + GSAP, R3F + Framer Motion, Locomotive + ScrollTrigger), manage performance, handle SSR, or architect complex animation systems.
---

# 3D & Animation Integration Patterns Skill

You are an expert in combining 3D and animation libraries. Know the right patterns for complex integrations:

## Three.js + GSAP ScrollTrigger
```js
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Link scroll to 3D object rotation
const obj = { progress: 0 };
gsap.to(obj, {
  progress: 1,
  scrollTrigger: { trigger: '.scene', start: 'top top', end: 'bottom bottom', scrub: 1 },
  onUpdate: () => {
    mesh.rotation.y = obj.progress * Math.PI * 2;
    camera.position.z = 5 - obj.progress * 2;
  },
});
```

## Locomotive Scroll + GSAP ScrollTrigger
```js
const scroll = new LocomotiveScroll({ el: wrapper, smooth: true });

// Proxy scroll for GSAP
scroll.on('scroll', ScrollTrigger.update);
ScrollTrigger.scrollerProxy(wrapper, {
  scrollTop(value) {
    return arguments.length
      ? scroll.scrollTo(value, 0, 0)
      : scroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect: () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }),
});

ScrollTrigger.addEventListener('refresh', () => scroll.update());
ScrollTrigger.refresh();
```

## React Three Fiber + Framer Motion
```jsx
// Animate HTML overlay synced with R3F canvas
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useScroll, useTransform } from 'framer-motion';

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <div style={{ position: 'relative' }}>
      <Canvas style={{ position: 'fixed', inset: 0 }}>
        <Scene scrollProgress={scrollYProgress} />
      </Canvas>
      <motion.div style={{ opacity, scale, position: 'relative', zIndex: 10 }}>
        <h1>Hero Title</h1>
      </motion.div>
    </div>
  );
}
```

## Performance Patterns

### Detect Low-End Devices
```js
const isLowEnd = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
if (isLowEnd) {
  // Use CSS animations instead of 3D
  document.body.classList.add('reduced-motion');
}
```

### Prefer Reduced Motion
```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.defaults({ duration: prefersReduced ? 0 : 0.8 });
```

### Lazy Load 3D
```js
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    import('./threejs-scene').then(({ init }) => init());
    observer.disconnect();
  }
}, { threshold: 0.1 });
observer.observe(document.querySelector('#scene-container'));
```

## Library Combination Matrix
| Use Case | Primary | Secondary |
|----------|---------|-----------|
| Scroll 3D | Three.js | GSAP ScrollTrigger |
| React 3D | R3F | Framer Motion |
| Smooth scroll | Locomotive | GSAP |
| Page transitions | Barba.js | GSAP |
| 2D games | PixiJS | Anime.js |
| VR/AR | A-Frame | - |
| 3D games | PlayCanvas | - |
| Branded animations | Rive | - |
| Micro-animations | Framer Motion | React Spring |
