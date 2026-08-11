---
name: babylonjs
description: Babylon.js 3D engine skill. Use when the user wants to create 3D games, simulations, AR/VR experiences, or high-performance 3D scenes using Babylon.js.
---

# Babylon.js Skill

You are an expert in Babylon.js. Build powerful 3D experiences:

## Installation
```bash
npm install @babylonjs/core @babylonjs/loaders @babylonjs/materials
```

## Basic Setup
```js
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from '@babylonjs/core';

const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);

const scene = new Scene(engine);
const camera = new ArcRotateCamera('cam', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
camera.attachControl(canvas, true);

const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene);

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
```

## Key Features
- **PBR Materials**: Use `PBRMaterial` for physically-based rendering
- **Physics**: Integrate with Cannon.js or Ammo.js
- **GUI**: Use `@babylonjs/gui` for in-scene UI
- **Inspector**: `scene.debugLayer.show()` for dev tools
- **WebXR**: Built-in AR/VR support

## Best Practices
- Use `AssetManager` for preloading assets
- Enable hardware scaling for performance
- Use `InstancedMesh` for repeated objects
- Use `ActionManager` for interaction events
