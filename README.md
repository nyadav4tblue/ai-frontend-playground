# AI Frontend Playground

A personal collection of AI-assisted frontend experiments. Each package is an isolated mini project exploring different frontend concepts, animations, and interactive experiences.

## Philosophy

- Each package is **standalone** — run it independently
- Code prioritizes **readability** over optimization
- Experiments with **modern patterns**: hooks, composition, animations
- Generated with **Claude** as a learning companion

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [romantic-invitation](./packages/romantic-invitation) | Multi-step romantic invitation builder with shareable URL | ✅ Ready |
| [interactive-survey](./packages/interactive-survey) | Animated survey/quiz experience | 🚧 Planned |
| [animated-story](./packages/animated-story) | Scroll-driven storytelling | 🚧 Planned |
| [portfolio-builder](./packages/portfolio-builder) | Drag-and-drop portfolio creator | 🚧 Planned |
| [landing-page](./packages/landing-page) | Modern animated landing page | 🚧 Planned |
| [form-experiments](./packages/form-experiments) | Fancy form UI experiments | 🚧 Planned |
| [animation-lab](./packages/animation-lab) | Framer Motion animation playground | 🚧 Planned |
| [component-library](./packages/component-library) | Reusable component showcase | 🚧 Planned |

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool & dev server
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **React Router v6** — Routing
- **shadcn/ui** — Accessible component primitives
- **Lucide Icons** — Icon set
- **pnpm workspaces** — Monorepo management

## Getting Started

```bash
# Install all dependencies
pnpm install

# Run the romantic invitation module
pnpm dev:romantic

# Or navigate to a package directly
cd packages/romantic-invitation
pnpm dev
```

## Structure

```
ai-frontend-playground/
├── apps/              # Full applications (future)
├── packages/          # Independent mini experiments
│   ├── romantic-invitation/
│   ├── interactive-survey/
│   └── ...
├── shared/            # Shared utilities (future)
├── docs/              # Notes and learnings
└── prompts/           # Claude prompts used to generate experiments
```
