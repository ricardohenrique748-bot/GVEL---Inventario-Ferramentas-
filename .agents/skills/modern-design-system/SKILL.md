---
name: modern-design-system
description: Modern design system and UI/UX skill. Use when the user wants to create a premium, modern design system with glassmorphism, dark mode, neumorphism, gradient systems, typography scales, color tokens, micro-animations, and cutting-edge CSS techniques.
---

# Modern Design System Skill

You are an expert in modern web design systems. Create stunning, premium interfaces:

## Color System
```css
:root {
  /* Brand */
  --brand-50: hsl(250, 100%, 97%);
  --brand-400: hsl(250, 80%, 65%);
  --brand-500: hsl(250, 75%, 55%);
  --brand-600: hsl(250, 70%, 45%);

  /* Neutral */
  --neutral-900: hsl(220, 20%, 8%);
  --neutral-800: hsl(220, 15%, 12%);
  --neutral-700: hsl(220, 12%, 18%);
  --neutral-100: hsl(220, 10%, 92%);

  /* Semantic */
  --bg-primary: var(--neutral-900);
  --bg-surface: var(--neutral-800);
  --text-primary: hsl(0, 0%, 95%);
  --text-secondary: hsl(220, 10%, 65%);
  --accent: var(--brand-500);
}
```

## Typography Scale
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', -apple-system, sans-serif;
  --text-xs: clamp(0.7rem, 1.5vw, 0.75rem);
  --text-sm: clamp(0.85rem, 2vw, 0.875rem);
  --text-base: clamp(1rem, 2.5vw, 1rem);
  --text-lg: clamp(1.1rem, 3vw, 1.125rem);
  --text-xl: clamp(1.2rem, 3.5vw, 1.25rem);
  --text-2xl: clamp(1.4rem, 4vw, 1.5rem);
  --text-3xl: clamp(1.7rem, 5vw, 1.875rem);
  --text-4xl: clamp(2rem, 6vw, 2.25rem);
  --text-5xl: clamp(2.5rem, 8vw, 3rem);
  --text-6xl: clamp(3rem, 10vw, 3.75rem);
}
```

## Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.glass-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
  border-radius: 20px;
}
```

## Shadows (Multi-layer)
```css
.shadow-premium {
  box-shadow:
    0 1px 2px rgba(0,0,0,0.4),
    0 4px 8px rgba(0,0,0,0.3),
    0 16px 32px rgba(0,0,0,0.2),
    0 0 0 1px rgba(255,255,255,0.05);
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.15);
}
```

## Gradient Mesh Background
```css
.mesh-bg {
  background-color: #0a0a0f;
  background-image:
    radial-gradient(at 40% 20%, hsla(250, 80%, 50%, 0.3) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(200, 80%, 50%, 0.2) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(310, 80%, 50%, 0.2) 0px, transparent 50%);
}
```

## Micro-Animations
```css
.interactive {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s ease,
              opacity 0.2s ease;
}
.interactive:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}
.interactive:active { transform: scale(0.97); }
```

## Best Practices
- Always use `clamp()` for responsive typography
- Prefer HSL for easier color manipulation
- Use `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring-like hover effects
- Layer multiple box-shadows for depth
- Use CSS custom properties for theming
- Apply `will-change: transform` sparingly on animated elements
