import type { ChoiceOption, Step } from '../types'

// ─── Wizard Steps ──────────────────────────────────────────────────────────────
export const STEPS: Step[] = [
  { id: 0, key: 'senderName',    title: 'Who are you?',           subtitle: 'Your name, lovely one',        emoji: '✨' },
  { id: 1, key: 'recipientName', title: 'Who is your love?',      subtitle: "The one who makes your heart flutter", emoji: '💕' },
  { id: 2, key: 'date',          title: 'Pick the perfect date',  subtitle: 'When will the magic happen?',  emoji: '📅' },
  { id: 3, key: 'place',         title: 'Where shall we meet?',   subtitle: 'Choose your dream setting',    emoji: '🌹' },
  { id: 4, key: 'food',          title: 'What shall we taste?',   subtitle: 'Pick one or many delights',    emoji: '🍽️' },
  { id: 5, key: 'dressColor',    title: 'What will you wear?',    subtitle: 'Choose your color for the night', emoji: '👗' },
  { id: 6, key: 'loveLetter',    title: 'Write from the heart',   subtitle: 'Say what words can barely hold', emoji: '💌' },
  { id: 7, key: 'summary',       title: 'Your invitation is ready', subtitle: 'Share it with your special someone', emoji: '🎉' },
]

// ─── Place Options ─────────────────────────────────────────────────────────────
export const PLACE_OPTIONS: ChoiceOption[] = [
  { value: 'rooftop',    label: 'Rooftop Under Stars',   emoji: '🌃', description: 'City lights & candlelight' },
  { value: 'beach',      label: 'Sunset Beach',          emoji: '🌅', description: 'Waves & golden hour' },
  { value: 'forest',     label: 'Enchanted Forest',      emoji: '🌲', description: 'Fairy lights in the trees' },
  { value: 'restaurant', label: 'Fine Dining',           emoji: '🕯️', description: 'An intimate table for two' },
  { value: 'garden',     label: 'Blooming Garden',       emoji: '🌸', description: 'Flowers & soft lanterns' },
  { value: 'home',       label: 'Cozy Home',             emoji: '🏠', description: 'Our own little universe' },
]

// ─── Food Options ──────────────────────────────────────────────────────────────
export const FOOD_OPTIONS: ChoiceOption[] = [
  { value: 'wine',       label: 'Fine Wine',            emoji: '🍷' },
  { value: 'sushi',      label: 'Sushi',                emoji: '🍣' },
  { value: 'pasta',      label: 'Homemade Pasta',       emoji: '🍝' },
  { value: 'chocolate',  label: 'Dark Chocolate',       emoji: '🍫' },
  { value: 'champagne',  label: 'Champagne',            emoji: '🥂' },
  { value: 'strawberry', label: 'Strawberries',         emoji: '🍓' },
  { value: 'cheese',     label: 'Cheese Board',         emoji: '🧀' },
  { value: 'dessert',    label: 'Fancy Dessert',        emoji: '🍮' },
]

// ─── Dress Color Palette ───────────────────────────────────────────────────────
// Each entry is a named color with its hex value
export const DRESS_COLORS = [
  { label: 'Crimson',      value: '#dc143c' },
  { label: 'Blush',        value: '#ffb6c1' },
  { label: 'Midnight',     value: '#191970' },
  { label: 'Emerald',      value: '#2e8b57' },
  { label: 'Gold',         value: '#ffd700' },
  { label: 'Ivory',        value: '#fffff0' },
  { label: 'Burgundy',     value: '#800020' },
  { label: 'Lavender',     value: '#e6e6fa' },
  { label: 'Champagne',    value: '#f7e7ce' },
  { label: 'Sapphire',     value: '#0f52ba' },
  { label: 'Rose Gold',    value: '#b76e79' },
  { label: 'Onyx',         value: '#353839' },
]
