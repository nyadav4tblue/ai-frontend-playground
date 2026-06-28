# Romantic Invitation

A multi-step invitation builder with glassmorphism UI, Framer Motion animations, and a fully shareable URL — no backend required.

## Features

- **Multi-step wizard** — 8 guided steps to craft the perfect invitation
- **Glassmorphism UI** — frosted glass cards over a deep purple gradient
- **Floating hearts** — animated background hearts using Framer Motion
- **Confetti burst** — celebrates when the invitation is completed
- **Date & time picker** — native inputs styled to match the theme
- **Place selector** — 6 romantic venue options
- **Food selector** — multi-select from 8 delightful choices
- **Dress color picker** — 12-color palette with live preview swatch
- **Love letter** — styled textarea with Playfair Display typography
- **Invitation card** — elegant printed-card summary
- **Shareable URL** — entire state encoded as compact URL params

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router v6
- Lucide Icons

## Running

```bash
pnpm install
pnpm dev
```

## Architecture

```
src/
├── App.tsx              # Root — Hero vs Wizard screen switch
├── types.ts             # InvitationData, Step, ChoiceOption types
├── hooks/
│   ├── useInvitation.ts # Central state + URL sync
│   └── useStep.ts       # Wizard step navigation
├── utils/
│   ├── constants.ts     # Steps, place/food/color options
│   └── urlState.ts      # encode/decode invitation ↔ URL params
└── components/
    ├── Hero.tsx          # Landing screen with animated intro
    ├── FloatingHearts.tsx# Background floating hearts
    ├── Confetti.tsx      # Celebration confetti burst
    ├── ProgressBar.tsx   # Step progress indicator
    ├── QuestionCard.tsx  # Glass panel wrapper per step
    ├── ChoiceCard.tsx    # Selectable option card
    ├── DatePicker.tsx    # Styled date + time inputs
    ├── LoveLetter.tsx    # Parchment-style textarea
    ├── InvitationCard.tsx# Final printed invitation display
    ├── WizardPage.tsx    # Orchestrates all steps
    └── ShareModal.tsx    # URL share slide-up panel
```

## Key Concepts Demonstrated

- **URL as state** — `encodeInvitation` / `decodeInvitation` in `urlState.ts`
- **Framer Motion variants** — stagger children, page transitions with `AnimatePresence`
- **Custom hooks** — `useInvitation` separates state from UI
- **Component composition** — `WizardPage` renders step content via a switch


## 🎨 Enhanced Romantic Design System

### Design Improvements
The application has been enhanced with a comprehensive romantic design system including:

- **Enhanced Glassmorphism** - Improved frosted glass effects with better blur and saturation
- **Romantic Color Palette** - Extended colors including rose, blush, coral, lavender, and gold
- **Animated Elements** - Floating hearts, gentle pulses, heartbeat animations
- **Gradient Effects** - Text gradients, border gradients, and background overlays
- **Enhanced Typography** - Playfair Display for romantic headings with gradient effects

### New Components
- `EnhancedFloatingHearts` - Advanced heart animations with multiple styles
- `RomanticBackground` - Layered background with light effects
- `EnhancedNavigation` - Glass navigation with romantic styling
- Enhanced pages with romantic themes throughout

### Design Documentation
See `DESIGN_SYSTEM.md` and `DESIGN_IMPROVEMENTS_SUMMARY.md` for complete design guidelines and implementation details.

---

**Experience the romance** - Every interaction is designed to create beautiful, emotional moments ❤️