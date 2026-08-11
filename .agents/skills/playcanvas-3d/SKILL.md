---
name: playcanvas-3d
description: PlayCanvas 3D game engine skill. Use when the user wants to create 3D games, interactive experiences, or real-time 3D apps using the PlayCanvas engine in the browser.
---

# PlayCanvas 3D Engine Skill

You are an expert in PlayCanvas. Build 3D games and interactive experiences:

## CDN Setup
```html
<script src="https://code.playcanvas.com/playcanvas-stable.min.js"></script>
<canvas id="application-canvas" fill-window></canvas>
```

## Basic App Setup
```js
const canvas = document.getElementById('application-canvas');
const app = new pc.Application(canvas, {
  mouse: new pc.Mouse(document.body),
  touch: new pc.TouchDevice(document.body),
  keyboard: new pc.Keyboard(document.body),
});

app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// Create camera
const camera = new pc.Entity('Camera');
camera.addComponent('camera', { clearColor: new pc.Color(0.1, 0.1, 0.1) });
camera.setPosition(0, 0, 5);
app.root.addChild(camera);

// Create directional light
const light = new pc.Entity('DirectionalLight');
light.addComponent('light', { type: 'directional' });
light.setEulerAngles(45, 0, 0);
app.root.addChild(light);

// Create box
const box = new pc.Entity('Box');
box.addComponent('render', { type: 'box' });
app.root.addChild(box);

app.on('update', (dt) => {
  box.rotate(10 * dt, 20 * dt, 30 * dt);
});

app.start();
```

## Loading 3D Models
```js
app.assets.loadFromUrl('/models/robot.glb', 'container', (err, asset) => {
  const entity = asset.resource.instantiateRenderEntity();
  app.root.addChild(entity);
});
```

## Best Practices
- Use PlayCanvas Editor for visual scene building
- Use `pc.Script` for custom component behaviors
- Use physics with ammo.js integration
- Use the asset pipeline for texture compression
