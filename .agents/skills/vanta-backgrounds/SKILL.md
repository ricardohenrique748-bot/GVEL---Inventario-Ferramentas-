---
name: vanta-backgrounds
description: Vanta.js animated background skill. Use when the user wants animated 3D or particle backgrounds (waves, clouds, birds, rings, etc.) using Vanta.js for websites and landing pages.
---

# Vanta.js Animated Backgrounds Skill

You are an expert in Vanta.js. Create stunning animated backgrounds:

## Installation
```bash
npm install vanta three
# Or via CDN
```

## CDN Usage
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"></script>
```

## Available Effects
- `WAVES` - Animated ocean waves
- `BIRDS` - Flying bird particles
- `NET` - Connected network nodes
- `CLOUDS` - Moving cloud formations
- `GLOBE` - Rotating 3D globe
- `RINGS` - Animated ring particles
- `TRUNK` - Growing tree trunks
- `FOG` - Atmospheric fog

## Usage
```js
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';

const effect = WAVES({
  el: '#hero',
  THREE,
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x0d1b2a,
  shininess: 50.00,
  waveHeight: 15.00,
  waveSpeed: 0.75,
  zoom: 0.65,
});

// React cleanup
useEffect(() => {
  return () => effect && effect.destroy();
}, []);
```

## Best Practices
- Always call `.destroy()` on component unmount
- Set `minHeight` and `minWidth` to prevent layout issues
- Use dark, rich colors for dramatic effects
- Combine with glassmorphism UI elements on top
