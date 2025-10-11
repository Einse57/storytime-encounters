# ⚔️ Storytime Encounters

> Your Ad Hoc D&D Companion

A lightweight, browser-based D&D-inspired session aid that supports spontaneous storytelling and guided gameplay. It provides core mechanics—dice, mobs, HP, and loot—while introducing D&D concepts in-context.

![Sprint Status](https://img.shields.io/badge/Sprint-3%20Complete-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Tailwind-blue)

## 🎯 Product Goals

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

## 📦 Sprint Progress

### ✅ Sprint 1: Core Mechanics (COMPLETE)
**Goal:** Prove core interactivity and validate base mechanics

#### Delivered Features
- [x] **Dice Roller**
  - Support for d4, d6, d8, d10, d12, d20, d100
  - Quantity selection (1-20 dice)
  - Modifier input (positive/negative)
  - Optional roll descriptions
  - Roll history with timestamps (last 50 rolls)
  - Clear notation display (e.g., "2d20+5 = 28")

- [x] **Mob Library**
  - 10 pre-configured creatures across CR 0.25-5
    - Goblin, Orc, Skeleton, Wolf, Bandit (Low CR)
    - Zombie, Ogre, Owlbear (Mid CR)
    - Troll, Red Dragon Wyrmling (High CR)
  - Level-scaled HP calculation (base HP × [1 + 0.2 × (level - 1)])
  - AC and Challenge Rating display
  - Moveset with damage dice notation
  - Loot table assignment per creature type

- [x] **Encounter Tracker**
  - Add multiple entities to active encounter
  - Visual HP bars with color coding
    - Green: > 66% HP
    - Yellow: 33-66% HP
    - Red: < 33% HP
  - Damage/heal controls with amount input
  - Turn tracking with visual "Current Turn" indicator
  - Remove defeated entities
  - Clear entire encounter

- [x] **Loot Log**
  - Auto-generate loot from mob loot tables
  - Rarity-based color coding
    - Common (gray), Uncommon (green), Rare (blue)
    - Very Rare (purple), Legendary (yellow)
  - Item type icons (⚔️ weapon, 🛡️ armor, 💰 currency, etc.)
  - Timestamp tracking
  - Source tracking (mob name + level)
  - Item statistics display

- [x] **UI/UX**
  - Three-pane responsive layout (Controls | Encounter | Logs)
  - Parchment-themed styling
  - Accessible form controls
  - Professional header/footer

#### Technical Foundation
- React 18 + TypeScript
- Vite build system
- Tailwind CSS with custom parchment theme
- Zustand state management
- Static JSON data (mobs, loot tables)

---

### ✅ Sprint 2: Session System (COMPLETE)
**Goal:** Add persistence and role assignment

#### Delivered Features
- [x] **Player Creation**
  - 12 D&D classes (Fighter, Wizard, Rogue, Cleric, Ranger, Paladin, Barbarian, Bard, Druid, Monk, Sorcerer, Warlock)
  - Auto-calculate HP based on hit die and level
  - Auto-calculate AC based on class armor proficiency
  - Display class description and stats
  - Add players to encounter tracker

- [x] **Loot Assignment**
  - Assign loot items to specific players via dropdown
  - Unassign loot if needed
  - Visual indicators for assigned items (purple player icon)
  - Player-based loot filtering

- [x] **Data Persistence**
  - Automatic session save to localStorage
  - Restore session on page reload
  - Export session data to JSON file
  - Import saved sessions from JSON
  - Clear session with confirmation

#### Quality & Polish
- [x] **Verification: Dice Randomness**
  - Verified dice rolls use Math.random() correctly
  - Formula: Math.floor(Math.random() * dieType) + 1
  - Produces genuinely random results

- [x] **UX Improvements**
  - Changed "CR" to "Challenge" in creature selector
  - Added help text: "Challenge Rating indicates difficulty - higher = tougher"
  - Improved player vs mob visual distinction (purple vs blue theme)

---

### ✅ Sprint 3: Narrative + Polish (COMPLETE)
**Goal:** Make demo-ready with contextual learning

#### Delivered Features
- [x] **Tooltip System**
  - Inline tooltips for 16 D&D concepts (HP, AC, Challenge, Roll, Modifier, Hit Die, Initiative, Level, Attack, Damage, Heal, Class, Loot, Rarity, Turn, Encounter)
  - Comprehensive glossary JSON with clear definitions
  - Hover-triggered popovers with accessible design (ARIA labels, keyboard navigation)
  - Smart positioning (auto-adjusts based on available space)
  - Integrated throughout DiceRoller, EncounterTracker, MobSelector, and PlayerCreator

- [x] **Story Seed Generator**
  - Random premise generator with 20 settings, 20 conflicts, and 20 hooks
  - Beautiful gradient-styled cards for setting, conflict, and hook
  - Randomize button with smooth animations
  - Auto-generates seed on component mount
  - Over 8,000 unique story combinations

- [x] **Dice Roll Improvements**
  - Limited roll history to last 5 rolls (cleaner interface)
  - Added "Last 5 rolls" visual indicator
  - Improved readability for quick reference during gameplay

- [x] **Theme & Polish**
  - Enhanced parchment visual design with gradients
  - Smooth fade animations for story seed generation
  - Hover effects and transitions throughout
  - Fully responsive grid layout
  - Accessibility improvements (ARIA labels, keyboard focus states, semantic HTML)

---

### 📅 Sprint 4: Deployment (PLANNED)
**Goal:** Production deployment and optimization

---

### � Sprint 3: Narrative + Polish (IN PROGRESS)
**Goal:** Make demo-ready with contextual learning

#### Planned Features
- [ ] **Tooltip System**
  - Inline tooltips for D&D concepts
  - Terms: HP, AC, Challenge, Roll, Modifier, Hit Die, etc.
  - Glossary JSON with definitions
  - Hover-triggered popovers using accessible design

- [ ] **Story Seed Generator**
  - Random premise generator
  - Setting + conflict + hook templates
  - Quick narrative starts for ad hoc sessions
  - Randomize button for new seeds

- [ ] **Dice Roll Improvements**
  - Limit roll history to last 5 rolls (reduce clutter)
  - Add "Keep Last 5" indicator
  - Improve readability for quick reference

- [ ] **Theme & Polish**
  - Enhanced parchment visual design
  - Smooth animations and transitions
  - Mobile-responsive improvements
  - Accessibility audit (ARIA labels, keyboard nav)
  - Loading states and error handling

---

### 📅 Sprint 4: Deployment (PLANNED)
**Goal:** Production deployment and optimization

#### Planned Features
- [ ] **Deployment**
  - Firebase or Vercel hosting setup
  - Production build optimization
  - Environment configuration
  - Custom domain setup (optional)

- [ ] **Performance**
  - Code splitting and lazy loading
  - Asset optimization
  - Lighthouse audit and improvements

- [ ] **Documentation**
  - User guide / tutorial
  - API documentation for data files
  - Contributing guidelines

---

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

1. **Primary:** DMs running one-shots or improvisational sessions
2. **Secondary:** New players learning D&D basics

---

## 📄 License

MIT License - Built as a portfolio project demonstrating product design and full-stack development.

---

## 🙏 Acknowledgments

Built with ❤️ for storytellers and adventurers.

**Tech:** React, TypeScript, Tailwind CSS, Zustand, Vite  
**Inspiration:** D&D 5e, improvisational storytelling, accessibility-first design
