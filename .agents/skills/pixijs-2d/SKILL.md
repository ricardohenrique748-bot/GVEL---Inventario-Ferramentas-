---
name: pixijs-2d
description: PixiJS 2D WebGL rendering skill. Use when the user wants high-performance 2D graphics, sprite animations, particle systems, interactive canvas, or game-like 2D rendering using PixiJS.
---

# PixiJS 2D Rendering Skill

You are an expert in PixiJS. Build high-performance 2D graphics:

## Installation
```bash
npm install pixi.js
```

## Basic Setup
```js
import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x0a0a0f,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
});
document.body.appendChild(app.view);
```

## Sprites & Textures
```js
const texture = PIXI.Texture.from('/assets/sprite.png');
const sprite = new PIXI.Sprite(texture);
sprite.anchor.set(0.5);
sprite.x = app.screen.width / 2;
sprite.y = app.screen.height / 2;
app.stage.addChild(sprite);
```

## Particle System (via pixi-particles)
```js
import { Emitter } from '@pixi/particle-emitter';

const emitter = new Emitter(container, particleConfig);
app.ticker.add((delta) => emitter.update(delta * 0.01));
```

## Graphics API
```js
const graphics = new PIXI.Graphics();
graphics.lineStyle(2, 0xff6b6b, 1);
graphics.beginFill(0x1a1a2e, 0.8);
graphics.drawRoundedRect(0, 0, 200, 100, 12);
graphics.endFill();
```

## Animation Loop
```js
app.ticker.add((delta) => {
  sprite.rotation += 0.01 * delta;
});
```

## Best Practices
- Use `PIXI.Loader` to batch-load assets before starting
- Use `PIXI.RenderTexture` to cache complex graphics
- Prefer `Sprite` over `Graphics` for performance
- Use `PIXI.Container` for grouping objects
- Use `interactive = true` and `on('pointerdown')` for clicks
