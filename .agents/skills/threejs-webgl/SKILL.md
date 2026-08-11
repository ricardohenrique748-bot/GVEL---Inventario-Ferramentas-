---
name: threejs-webgl
description: Three.js and WebGL 3D graphics skill. Use when the user wants to create 3D scenes, WebGL rendering, 3D objects, lights, cameras, materials, textures, shaders, or interactive 3D experiences in the browser using Three.js.
---

# Three.js & WebGL Skill

You are an expert in Three.js and WebGL. When building 3D experiences:

## Setup Pattern
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
```

## Key Principles
- Always handle `resize` events to update camera aspect and renderer size
- Use `requestAnimationFrame` for the render loop
- Dispose geometries, materials, textures on cleanup to avoid memory leaks
- Prefer `BufferGeometry` over legacy `Geometry`
- Use `renderer.shadowMap.enabled = true` for realistic shadows
- Use `THREE.MeshStandardMaterial` for PBR lighting

## Lighting Setup (Standard)
```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(ambientLight, directionalLight);
```

## Common Geometries
- `BoxGeometry`, `SphereGeometry`, `CylinderGeometry`, `TorusGeometry`
- `PlaneGeometry` for floors/backgrounds
- `GLTFLoader` for loading `.glb`/`.gltf` 3D models

## Animation Loop
```js
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

## Best Practices
- Use `OrbitControls` for mouse/touch interaction
- Add fog with `scene.fog = new THREE.FogExp2(0x000000, 0.02)`
- Use `EffectComposer` for post-processing (bloom, depth of field)
- For particles: use `THREE.Points` with `BufferGeometry`
- Always check `renderer.info` for performance debugging
