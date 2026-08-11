---
name: spline-3d
description: Spline 3D design skill. Use when the user wants to embed interactive 3D designs created in Spline into web or React apps using the @splinetool/react-spline or @splinetool/runtime packages.
---

# Spline 3D Skill

You are an expert in embedding Spline 3D designs into web apps:

## Installation
```bash
# React
npm install @splinetool/react-spline @splinetool/runtime

# Vanilla JS
npm install @splinetool/runtime
```

## React Embed
```jsx
import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <main>
      <Spline scene="https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode" />
    </main>
  );
}
```

## With Event Handling
```jsx
import Spline from '@splinetool/react-spline';
import { useRef } from 'react';

function SplineScene() {
  const spline = useRef();

  function onLoad(splineApp) {
    spline.current = splineApp;
  }

  function triggerAnimation() {
    spline.current.emitEvent('mouseDown', 'ObjectName');
  }

  return (
    <>
      <Spline scene="https://prod.spline.design/ID/scene.splinecode" onLoad={onLoad} />
      <button onClick={triggerAnimation}>Trigger</button>
    </>
  );
}
```

## Vanilla JS
```js
import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);
app.load('https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode');
```

## Best Practices
- Export scene as `.splinecode` from Spline editor
- Host `.splinecode` files on CDN for performance
- Use `loading="lazy"` for below-fold scenes
- Wrap in `Suspense` with a fallback loader
- Combine with scroll triggers to show/hide based on scroll position
- Design scenes with `transparent background` option in Spline

## Workflow
1. Design 3D scene in [Spline](https://spline.design)
2. Export → Web → Copy embed URL
3. Paste URL in `scene` prop
