---
name: lottie-animations
description: Lottie animation skill. Use when the user wants to embed JSON-based vector animations (from Adobe After Effects / LottieFiles) in web or React apps using lottie-web or @lottiefiles/react-lottie-player.
---

# Lottie Animations Skill

You are an expert in Lottie animations. Embed After Effects animations in the web:

## Installation
```bash
# Vanilla JS
npm install lottie-web

# React
npm install @lottiefiles/react-lottie-player
# or
npm install lottie-react
```

## Vanilla JS Setup
```js
import lottie from 'lottie-web';

const anim = lottie.loadAnimation({
  container: document.getElementById('lottie-container'),
  renderer: 'svg', // 'canvas' or 'html'
  loop: true,
  autoplay: true,
  path: '/animations/data.json', // or use animationData: require('./data.json')
});

// Controls
anim.pause();
anim.play();
anim.stop();
anim.setSpeed(1.5);
anim.setDirection(-1); // reverse
anim.goToAndStop(30, true); // go to frame 30
```

## React (lottie-react)
```jsx
import Lottie from 'lottie-react';
import animationData from './animation.json';

function LoadingSpinner() {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## React with Player
```jsx
import { Player, Controls } from '@lottiefiles/react-lottie-player';

<Player autoplay loop src="/animations/success.json" style={{ height: '300px', width: '300px' }}>
  <Controls visible={false} />
</Player>
```

## Interactive on Hover
```js
const anim = lottie.loadAnimation({ container, loop: false, autoplay: false, path: '/anim.json' });

container.addEventListener('mouseenter', () => anim.play());
container.addEventListener('mouseleave', () => { anim.stop(); });
```

## Best Practices
- Use SVG renderer for crisp quality, Canvas for performance
- Use `lottie-web` for vanilla, `lottie-react` for React
- Download animations from [LottieFiles.com](https://lottiefiles.com)
- Keep animation JSON files small (< 100KB)
- Use `segments` to play specific parts: `anim.playSegments([0, 60], true)`
