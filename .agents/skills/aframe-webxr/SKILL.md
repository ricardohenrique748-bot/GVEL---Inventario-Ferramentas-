---
name: aframe-webxr
description: A-Frame WebXR skill. Use when the user wants to create VR/AR experiences, 360° scenes, or immersive WebXR content using A-Frame HTML components.
---

# A-Frame WebXR Skill

You are an expert in A-Frame and WebXR. Build immersive VR/AR experiences with HTML:

## Basic Setup
```html
<script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>

<a-scene>
  <a-sky color="#ECECEC"></a-sky>
  <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow></a-box>
  <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" shadow></a-sphere>
  <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D" shadow></a-cylinder>
  <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" shadow></a-plane>
  <a-camera>
    <a-cursor></a-cursor>
  </a-camera>
</a-scene>
```

## Custom Components
```js
AFRAME.registerComponent('rotate-on-hover', {
  schema: { speed: { default: 100 } },
  init() {
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 1000');
    });
  }
});
```

## Best Practices
- Use `<a-assets>` for preloading images, audio, video
- Use `<a-entity>` with `gltf-model` for 3D models
- Enable VR with `<a-scene vr-mode-ui="enabled: true">`
- Use `cursor` component for gaze-based interaction
