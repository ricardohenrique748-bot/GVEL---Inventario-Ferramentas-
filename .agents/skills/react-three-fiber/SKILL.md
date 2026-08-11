---
name: react-three-fiber
description: React Three Fiber (R3F) skill. Use when the user wants to create 3D experiences inside React applications using @react-three/fiber, @react-three/drei, or @react-three/postprocessing. Includes declarative Three.js in JSX.
---

# React Three Fiber (R3F) Skill

You are an expert in React Three Fiber. Build 3D experiences declaratively inside React:

## Installation
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
```

## Basic Canvas Setup
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} shadows>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      <OrbitControls enableDamping />
      <MyScene />
    </Canvas>
  );
}
```

## Common Drei Helpers
- `<OrbitControls>` - mouse orbit camera
- `<Float>` - floating/bobbing animation
- `<Text>` - 3D text
- `<Html>` - HTML overlaid on 3D objects
- `<Sparkles>` - particle effects
- `<MeshDistortMaterial>` - animated distortion material
- `<useGLTF>` - load GLTF models
- `<useTexture>` - load textures

## Animation with useFrame
```jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function RotatingBox() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.3;
  });
  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

## Post-Processing
```jsx
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

<EffectComposer>
  <Bloom luminanceThreshold={0.8} intensity={1.5} />
  <ChromaticAberration offset={[0.002, 0.002]} />
</EffectComposer>
```

## Best Practices
- Use `Suspense` to handle async asset loading
- Use `useGLTF.preload('/model.glb')` to preload models
- Use `useMemo` for heavy geometries/materials
- Avoid creating objects in the render loop (use refs and mutate)
- Use `<Perf />` from `r3f-perf` for performance monitoring
