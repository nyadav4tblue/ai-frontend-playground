# Romantic Invitation Design System

## Overview
Enhanced design system for the romantic invitation/relationship flow builder application with a focus on creating beautiful, emotional, and engaging user experiences.

## Color Palette

### Primary Romantic Colors
- **Rose Gradient**: `#f43f5e` → `#ff6b9d` → `#ff8e53`
- **Background Gradient**: `#0c0521` → `#1a0a2e` → `#16213e` → `#0f3460` → `#082255`

### Extended Romantic Colors
```css
rose: #f43f5e
blush: #ff6b9d
coral: #ff8e53
mauve: #c084fc
lavender: #a78bfa
gold: #fbbf24
```

### Background Layers
1. Deep space gradient (base layer)
2. Radial romantic glow overlays
3. Subtle texture patterns
4. Glassmorphism effects

## Typography

### Font Families
- **Headings**: Playfair Display (serif, romantic, elegant)
- **Body**: Lato (clean, readable, modern)
- **Accent**: Cormorant Garamond (for special romantic text)

### Text Styles
- `text-gradient-romantic`: Gradient text effect
- `font-heading`: Romantic heading style
- Custom selection colors with rose tint

## Glassmorphism Effects

### Glass Panel Variants
```css
.glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.08));
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 1.5rem;
}

.glass-light {
  /* Lighter variant for nested cards */
}

.glass-strong {
  /* Stronger variant for main sections */
}
```

### Border Effects
- `border-gradient-romantic`: Gradient borders
- Soft inner shadows and highlights
- Glow effects on hover

## Animations & Effects

### Key Animations
1. **Gentle Pulse**: Subtle opacity pulse (3s)
2. **Romantic Float**: Gentle floating with rotation (6s)
3. **Heartbeat**: Pulsing scale animation (1.5s)
4. **Glow**: Soft glow pulse (2s)

### Motion Principles
- Smooth, gentle movements
- Staggered animations for visual interest
- Subtle hover effects
- Page transition animations

## Component Design

### Buttons
- **Primary**: Gradient romantic button with hover effects
- **Secondary**: Glass button with subtle borders
- **Tertiary**: Text/icon buttons with romantic colors

### Cards & Sections
- Rounded corners (1.5rem - 2rem)
- Glass backgrounds with blur effects
- Gradient borders on hover
- Subtle shadow depth

### Navigation
- Fixed glass navigation bar
- Active state indicators with gradient underlines
- Smooth transitions between states

## Romantic Elements

### Background Elements
1. **Floating Hearts**: Animated hearts in various styles and colors
2. **Light Orbs**: Soft glowing orbs with gentle pulse
3. **Light Beams**: Subtle vertical light effects
4. **Sparkles**: Random sparkling effects

### Interactive Elements
- Hover states with romantic color shifts
- Click feedback with gentle scale animations
- Loading states with romantic spinners

## Layout Principles

### Spacing System
- Consistent padding/margin scales
- Visual hierarchy through spacing
- Responsive breakpoints for all devices

### Visual Hierarchy
1. Gradient text for main headings
2. Glass panels for content sections
3. Subtle animations for important elements
4. Color coding for status indicators

## Accessibility

### Color Contrast
- Maintain sufficient contrast for readability
- Use opacity variations for disabled states
- Clear visual feedback for interactions

### Motion Considerations
- Respect reduced motion preferences
- Subtle animations that don't cause distraction
- Clear focus states for keyboard navigation

## Implementation Guidelines

### Tailwind Classes
- Custom colors in `tailwind.config.js`
- Extended animation keyframes
- Custom glassmorphism utilities
- Romantic gradient utilities

### Component Patterns
- Use motion for page transitions
- Implement glass effects consistently
- Apply romantic color scheme throughout
- Maintain emotional tone in copy

## Emotion & Tone
The design should evoke feelings of:
- Romance and affection
- Warmth and comfort
- Elegance and sophistication
- Playfulness and joy

All visual elements should contribute to creating an emotionally engaging experience that feels personal, intimate, and beautiful.