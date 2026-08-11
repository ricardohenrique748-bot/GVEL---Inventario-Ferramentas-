---
name: react-spring
description: React Spring physics-based animation skill. Use when the user wants spring-physics animations in React, animated component transitions, drag interactions, or natural feeling motion using react-spring or @react-spring/web.
---

# React Spring Skill

You are an expert in React Spring. Create physics-based animations:

## Installation
```bash
npm install @react-spring/web
```

## Basic useSpring
```jsx
import { useSpring, animated } from '@react-spring/web';

function Card() {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <animated.div style={{ opacity, transform }} onClick={() => setFlipped(f => !f)}>
      Click me
    </animated.div>
  );
}
```

## useSprings (Multiple)
```jsx
import { useSprings, animated } from '@react-spring/web';

const springs = useSprings(items.length, items.map(item => ({
  from: { opacity: 0, y: 40 },
  to: { opacity: 1, y: 0 },
  delay: item.index * 100,
})));
```

## useTrail (Staggered)
```jsx
import { useTrail, animated } from '@react-spring/web';

const trail = useTrail(items.length, {
  from: { opacity: 0, x: -40 },
  to: { opacity: 1, x: 0 },
});
```

## useGesture (Drag)
```bash
npm install @use-gesture/react
```
```jsx
import { useDrag } from '@use-gesture/react';

const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
const bind = useDrag(({ offset: [ox, oy] }) => api.start({ x: ox, y: oy }));

<animated.div {...bind()} style={{ x, y }} />
```

## Config Presets
```js
import { config } from '@react-spring/web';
// config.default - medium spring
// config.gentle - slow, gentle
// config.wobbly - wobbly spring
// config.stiff - stiff, quick
// config.slow - very slow
// config.molasses - extremely slow
```
