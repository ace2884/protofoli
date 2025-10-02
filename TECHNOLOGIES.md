# Technologies used in this project

This repository implements a responsive, interactive portfolio website with a 3D-enhanced desktop UX and mobile/touch optimizations.

Core web technologies
- HTML5 (`index.html`)
- CSS3 (`style.css`) — responsive layout, 3D transforms, animations
- JavaScript (`script.js`) — site behaviors, navigation, project filtering

3D, animation, and interaction libraries
- Three.js — 3D scene, particle system, canvas rendering
- GSAP (GreenSock) + ScrollTrigger — timeline and scroll-based animations
- Lottie — lightweight vector animations
- Hammer.js — touch gesture recognition for mobile

Utilities & debugging
- dat.GUI — interactive debug controls

Build & deployment
- Served as static files (Python http.server for local testing)
- Optional: GitHub Pages for public hosting (deploy workflow added)

Performance & UX
- IntersectionObserver for lazy-loading and reveal animations
- Reduced motion handling with `prefers-reduced-motion`
- Vibration API on Android for haptic feedback

Notes
- CDN links are used for library dependencies (Three.js, GSAP, etc.). If you prefer local copies, add them to the `vendor/` folder and update `index.html`.
- The site intentionally uses minimal tooling to be runnable as static files; no build step is required.
