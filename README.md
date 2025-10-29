# ⚔️ Storytime Encounters

> Your D&D Inspired Storytime Companion

A lightweight, browser-based D&D-inspired session aid that supports spontaneous storytelling and guided gameplay. It provides core mechanics—dice, mobs, HP, and loot—while introducing D&D concepts in-context.

![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Tailwind-blue)

## 🎯 Goals

- **Instant Session Readiness** - Play starts in under 60 seconds
- **Story-Focused** - Keep players focused on story, not systems
- **Contextual Learning** - Teach core D&D ideas in-context
- **Lean Execution** - Demonstrate PM-led prioritization and product design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to start your adventure!

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Data:** Static JSON (mobs, loot, classes)
- **Deployment:** Firebase/Vercel (Sprint 4)

### Project Structure
```
src/
├── components/          # React components
│   ├── DiceRoller.tsx
│   ├── MobSelector.tsx
│   ├── EncounterTracker.tsx
│   ├── LootLog.tsx
│   ├── PlayerCreator.tsx
│   └── SessionControls.tsx
├── stores/             # Zustand state stores
│   ├── diceStore.ts
│   ├── encounterStore.ts
│   └── lootStore.ts
├── data/               # Static JSON data
│   ├── mobs.json
│   └── lootTable.json
├── types/              # TypeScript types
│   └── mob.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

---

## 🎮 Usage Guide

### Rolling Dice
1. Select die type (d4 - d100)
2. Choose quantity (1-20)
3. Add modifier (optional)
4. Add description (optional, e.g., "Attack roll")
5. Click "Roll"

### Running an Encounter
1. **Select a creature** from Mob Library
2. **Set level** to scale difficulty
3. **Add to Encounter** - creates instance in tracker
4. **Manage HP** - select entity, enter damage/heal amount
5. **Track turns** - click "Next Turn" to advance
6. **Generate loot** - click on mob preview when defeated

### Tracking Loot
- Loot is auto-generated from mob-specific tables
- View all drops in the Loot Log
- Filter by rarity, type, or assignment status (Sprint 2)

---

## 🎲 Game Data

### Available Creatures
| Name | CR | Base HP | AC | Loot Table |
|------|------|---------|-----|------------|
| Goblin | 0.25 | 7 | 15 | Common |
| Skeleton | 0.25 | 13 | 13 | Undead |
| Wolf | 0.25 | 11 | 13 | Beast |
| Bandit | 0.125 | 11 | 12 | Humanoid |
| Zombie | 0.25 | 22 | 8 | Undead |
| Orc | 0.5 | 15 | 13 | Common |
| Ogre | 2 | 59 | 11 | Common |
| Owlbear | 3 | 59 | 13 | Beast |
| Troll | 5 | 84 | 15 | Rare |
| Red Dragon Wyrmling | 4 | 75 | 17 | Treasure |

### Loot Categories
- **Common** - Basic items, copper coins, simple weapons
- **Humanoid** - Armor, weapons, potions, quest items
- **Beast** - Pelts, claws, meat
- **Undead** - Ancient coins, cursed items, bone dust
- **Rare** - Gold, +1 weapons, magic items
- **Treasure** - Platinum, gemstones, legendary artifacts

---

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Available Scripts
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Creatures
Edit `src/data/mobs.json`:
```json
{
  "id": "unique-id",
  "name": "Creature Name",
  "baseHP": 30,
  "ac": 14,
  "challenge": 1,
  "moveset": [
    { "name": "Attack", "damage": "1d8+2", "type": "melee" }
  ],
  "lootTable": "common"
}
```

### Adding New Loot
Edit `src/data/lootTable.json` - add items to appropriate category.

---

## 🎯 Design Principles

1. **Speed Over Depth** - Quick setup beats comprehensive rules
2. **Show, Don't Tell** - Teach D&D through interaction, not tutorials
3. **Minimal Friction** - Default to sensible choices, allow customization
4. **Transparent State** - Always show what's happening under the hood

---

## 📝 Roadmap Notes

### Sprint 2 Focus
- Player system integration
- Loot assignment workflow
- Data persistence (localStorage)

### Sprint 3 Focus
- Educational tooltips
- Story generation
- Production deployment
- Demo polish

### Future Enhancements (Post-MVP)
- Custom creature builder
- Spell tracking
- Combat log export
- Multi-DM session sharing
- Mobile app (PWA)

---

## 👥 Target Audience

1. **Primary:** Busy parents who wish they could be DMs running one-shots or improvisational sessions
2. **Secondary:** New players testing out D&D basics

---

## 📄 License

MIT License - Built as a portfolio project demonstrating product design and full-stack development.

---

## 🙏 Acknowledgments

**Tech:** React, TypeScript, Tailwind CSS, Zustand, Vite  
**Inspiration:** D&D 5e, improvisational storytelling, accessibility-first design
