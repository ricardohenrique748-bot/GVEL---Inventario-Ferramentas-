# Workspace Agent Rules

## Design & Animation Stack

Este workspace tem as seguintes skills de design e animação instaladas. Ao criar interfaces web, priorize sempre o uso dessas bibliotecas para criar experiências premium:

### 3D & WebGL
- **Three.js** (`threejs-webgl`) — cenas 3D, shaders, partículas
- **React Three Fiber** (`react-three-fiber`) — Three.js declarativo em React
- **Babylon.js** (`babylonjs`) — engine 3D para jogos e simulações
- **PlayCanvas** (`playcanvas-3d`) — engine 3D interativa
- **A-Frame** (`aframe-webxr`) — VR/AR com HTML
- **Spline** (`spline-3d`) — embed de designs 3D interativos
- **Vanta.js** (`vanta-backgrounds`) — backgrounds 3D animados

### Animação & Scroll
- **GSAP + ScrollTrigger** (`gsap-scrolltrigger`) — animações avançadas baseadas em scroll
- **Framer Motion** (`motion-framer`) — animações React declarativas
- **React Spring** (`react-spring`) — animações com física de mola
- **Anime.js** (`animejs`) — animações leves, SVG, DOM
- **AOS** (`aos-scroll-animations`) — reveal on scroll simples
- **Locomotive Scroll** (`locomotive-scroll`) — scroll suave premium
- **Barba.js** (`barbajs-transitions`) — transições entre páginas

### Assets & Components
- **Lottie** (`lottie-animations`) — animações After Effects no browser
- **Rive** (`rive-animations`) — animações interativas com state machines
- **Magic UI** (`magic-ui`) — componentes UI animados premium
- **PixiJS** (`pixijs-2d`) — renderização 2D WebGL de alta performance

### Design System & Integração
- **Modern Design System** (`modern-design-system`) — glassmorphism, dark mode, tokens
- **Integration Patterns** (`integration-patterns-3d`) — combinando bibliotecas

## Regras Gerais

1. **Sempre usar design premium** — evite interfaces simples. Use glassmorphism, gradientes, micro-animações.
2. **Fontes modernas** — sempre importar do Google Fonts (Inter, Outfit, Syne, etc.).
3. **Dark mode por padrão** — salvo quando o usuário pedir o contrário.
4. **Scroll suave** — em landing pages, usar Locomotive Scroll ou GSAP ScrollTrigger.
5. **Performance-first** — usar `will-change`, `transform`, e evitar reflows.
6. **Prefers-reduced-motion** — respeitar a preferência do sistema operacional do usuário.
