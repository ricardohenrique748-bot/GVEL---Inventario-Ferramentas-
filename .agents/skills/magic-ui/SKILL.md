---
name: magic-ui
description: Magic UI components skill. Use when the user wants pre-built animated React UI components like animated text, sparkles, shimmer buttons, border beams, marquees, or other premium UI effects from Magic UI or similar component libraries.
---

# Magic UI Components Skill

You are an expert in building Magic UI-style animated components. Recreate premium UI effects from scratch or using magic-ui:

## Installation (if using library)
```bash
npx magicui-cli add [component]
```

## Key Components to Build

### Shimmer Button
```jsx
const ShimmerButton = ({ children }) => (
  <button className="shimmer-button">
    <span className="shimmer-overlay" />
    {children}
    <style>{`
      .shimmer-button {
        position: relative;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none; border-radius: 8px; padding: 12px 24px;
        color: white; cursor: pointer; overflow: hidden;
      }
      .shimmer-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
      }
      @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
    `}</style>
  </button>
);
```

### Border Beam
```jsx
const BorderBeam = () => (
  <div className="border-beam-wrapper">
    <style>{`
      .border-beam-wrapper { position: relative; border-radius: 12px; padding: 1px; background: conic-gradient(from var(--angle), transparent 70%, #6366f1, transparent); animation: rotate 4s linear infinite; }
      @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes rotate { to { --angle: 360deg; } }
    `}</style>
  </div>
);
```

### Text Reveal (Word by Word)
```jsx
function TextReveal({ text }) {
  const words = text.split(' ');
  return (
    <p>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, ease: 'easeOut' }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
```

### Animated Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease infinite;
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Marquee
```jsx
function Marquee({ items, speed = 30 }) {
  return (
    <div style={{ overflow: 'hidden', display: 'flex' }}>
      <div style={{ display: 'flex', animation: `marquee ${speed}s linear infinite`, whiteSpace: 'nowrap' }}>
        {[...items, ...items].map((item, i) => <span key={i} style={{ padding: '0 2rem' }}>{item}</span>)}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
```

## Best Practices
- Build from scratch when possible for full control
- Use CSS `@property` for animatable custom properties
- Combine with Framer Motion for spring-based interactions
