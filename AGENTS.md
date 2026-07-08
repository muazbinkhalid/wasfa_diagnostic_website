<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:architecture-workflow-rules -->
# Architecture & Workflow Guidelines

When working on this portfolio website, you MUST follow these guidelines to ensure a highly scalable, clean, production-level architecture:

## 1. Architecture & Modularity
- **Component Design:** Build strictly decoupled, reusable components. Organize them into logical directories (e.g., `src/components`, `src/hooks`, `src/utils`).
- **Clean Code:** Prioritize readability and maintainability. Avoid deeply nested logic or monolithic files.
- **Type Safety:** Use strict TypeScript typing for all components, props, and utility functions. Do not use `any` unless absolutely necessary.
- **Performance First:** Optimize for performance. Use dynamic imports, server components where applicable, and lazy load heavy assets like 3D models or large images.

## 2. Agent Workflow & Efficiency
- **Atomic Changes:** Plan and execute your changes in small, logical, and atomic steps.
- **Verify Before Proceeding:** Always run build checks, linters, or manual verification steps before confirming a task is complete.
- **Self-Documentation:** Keep documentation (like `README.md`, or architecture artifacts) up to date with code changes. 

## 3. Premium Aesthetics & UI/UX
- **Design Excellence:** The UI MUST be visually stunning, using premium aesthetics—vibrant colors, smooth gradients, glassmorphism, or modern dark themes. Avoid generic or basic designs.
- **Micro-animations:** Incorporate subtle micro-animations (hover effects, transitions) for a dynamic and responsive user experience.
- **SEO & Accessibility:** Ensure all components are fully accessible (ARIA labels, semantic HTML) and SEO-optimized (meta tags, proper heading hierarchy).
<!-- END:architecture-workflow-rules -->
