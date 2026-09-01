# Storytime Encounters

A lightweight, mobile-first storytelling companion for parents, game masters, and imaginative storytellers. Designed to help you craft spontaneous adventures, roll dice, record your spoken tale, and illustrate comic scenes in real time.

## Core Features

- **Story Seed Generator:** Instantly roll randomized settings, conflicts, and plot hooks, with individual lock/unlock controls to keep the elements you like.
- **Story Sparks:** 1-click prompts for Loot, Creatures, and Plot Twists, complete with painterly game art, rarity tiers, and story hooks.
- **1-Tap Quick Dice:** Tactile 3D dice for instant checks (d6, d10, d20, and Roll All), plus expandable dice for full tabletop support.
- **Audio Studio & Speech Transcriber:** Live voice recorder with animated soundwaves and speech-to-text transcript logging to capture your adventure as you speak.
- **Comic & Picture Book Studio:** Automatically transforms your story prompts into illustrated comic strip panels with character speech bubbles, style presets, and a flipbook page reader.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Einse57/storytime-encounters.git
cd storytime-encounters

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open `http://localhost:5173` in your browser. On a mobile phone connected to the same Wi-Fi, use your local network IP (e.g. `http://192.168.x.x:5173`).

### Production Build

```bash
npm run build
```

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **AI Integrations:** Google Gemini API (speech transcription & scene illustrations)
