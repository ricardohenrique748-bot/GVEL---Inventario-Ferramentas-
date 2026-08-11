---
name: rive-animations
description: Rive interactive animation skill. Use when the user wants to embed interactive, state-machine-driven animations from Rive into web or React apps. Rive animations respond to user interaction and app state in real time.
---

# Rive Interactive Animations Skill

You are an expert in Rive animations. Embed reactive animations:

## Installation
```bash
# React
npm install @rive-app/react-canvas

# Vanilla JS
npm install @rive-app/canvas
```

## React Usage
```jsx
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

function RiveAnimation() {
  const { rive, RiveComponent } = useRive({
    src: '/animations/button.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  const isHover = useStateMachineInput(rive, 'State Machine 1', 'isHover');

  return (
    <RiveComponent
      onMouseEnter={() => isHover && (isHover.value = true)}
      onMouseLeave={() => isHover && (isHover.value = false)}
      style={{ width: 300, height: 300 }}
    />
  );
}
```

## Vanilla JS
```js
import Rive from '@rive-app/canvas';

const r = new Rive({
  src: 'https://cdn.rive.app/animations/vehicles.riv',
  canvas: document.getElementById('canvas'),
  autoplay: true,
  stateMachines: 'bumpy',
  onLoad: () => r.resizeDrawingSurfaceToCanvas(),
});
```

## Triggering State Machine Inputs
```js
const inputs = r.stateMachineInputs('State Machine 1');
const trigger = inputs.find(i => i.name === 'Click');
trigger.fire(); // trigger type

const hoverInput = inputs.find(i => i.name === 'isHover');
hoverInput.value = true; // boolean type

const speedInput = inputs.find(i => i.name === 'speed');
speedInput.value = 3.5; // number type
```

## Best Practices
- Export `.riv` files from [Rive editor](https://rive.app)
- Use State Machines for interactive, reactive animations
- Use Canvas renderer for best performance
- Use `resizeDrawingSurfaceToCanvas()` after resize events
- Combine with React state to drive animation inputs from app logic
