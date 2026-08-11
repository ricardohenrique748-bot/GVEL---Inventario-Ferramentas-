---
name: motion-framer
description: Framer Motion animation skill. Use when the user wants React animations, page transitions, gesture animations, layout animations, or declarative motion using Framer Motion.
---

# Framer Motion Skill

You are an expert in Framer Motion. Create fluid React animations:

## Installation
```bash
npm install framer-motion
```

## Basic Animations
```jsx
import { motion } from 'framer-motion';

// Simple animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  Content
</motion.div>
```

## Variants (Staggered)
```jsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i} variants={item}>{i}</motion.li>)}
</motion.ul>
```

## Gestures
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

## Layout Animations
```jsx
<motion.div layout layoutId="card" />
```

## useScroll + useTransform
```jsx
import { useScroll, useTransform } from 'framer-motion';

const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

<motion.div style={{ opacity }} />
```

## AnimatePresence (Exit Animations)
```jsx
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  {show && <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
</AnimatePresence>
```

## Best Practices
- Prefer `layout` animations over animating width/height directly
- Use `spring` transitions for natural feel: `{ type: 'spring', stiffness: 300, damping: 24 }`
- Use `willChange: 'transform'` hint for heavy animations
- Combine with `AnimatePresence` for route transitions
