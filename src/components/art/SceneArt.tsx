import React from 'react';

interface SceneArtProps {
  panelNumber: number;
  className?: string;
}

export const SceneArt: React.FC<SceneArtProps> = ({ panelNumber, className = 'w-full h-full' }) => {
  if (panelNumber === 1) {
    // Scene 1: The Journey Begins (Golden Dawn & Mountain Trail)
    return (
      <svg viewBox="0 0 400 225" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="mountainsFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="hillFore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="225" fill="url(#skyDawn)" />

        {/* Sun */}
        <circle cx="280" cy="110" r="32" fill="#fef08a" opacity="0.9" />
        <circle cx="280" cy="110" r="48" fill="#fef08a" opacity="0.4" />

        {/* Distant Mountains */}
        <polygon points="120,225 200,105 280,225" fill="url(#mountainsFar)" opacity="0.7" />
        <polygon points="220,225 310,95 400,225" fill="url(#mountainsFar)" opacity="0.8" />
        <polygon points="0,225 80,120 180,225" fill="url(#mountainsFar)" opacity="0.6" />

        {/* Rolling Green Hills */}
        <path d="M0 160 Q120 130 250 170 T400 150 L400 225 L0 225 Z" fill="url(#hillMid)" />
        <path d="M0 185 Q160 160 300 195 T400 175 L400 225 L0 225 Z" fill="url(#hillFore)" />

        {/* Winding Trail */}
        <path d="M120 225 C140 200, 180 190, 210 175 C240 165, 270 160, 290 150" stroke="#fde047" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

        {/* Storybook Pine Trees */}
        <polygon points="50,195 42,215 58,215" fill="#14532d" />
        <polygon points="50,185 44,200 56,200" fill="#15803d" />
        <polygon points="50,175 46,190 54,190" fill="#22c55e" />

        <polygon points="75,200 66,220 84,220" fill="#14532d" />
        <polygon points="75,190 68,206 82,206" fill="#15803d" />
        <polygon points="75,180 71,196 79,196" fill="#22c55e" />

        <polygon points="340,180 332,205 348,205" fill="#14532d" />
        <polygon points="340,170 334,188 346,188" fill="#15803d" />

        {/* Distant Birds */}
        <path d="M140 70 Q145 65 150 70 Q155 65 160 70" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <path d="M165 80 Q169 76 173 80 Q177 76 181 80" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (panelNumber === 2) {
    // Scene 2: The Encounter (Enchanted Forest Glade & Friendly Creature)
    return (
      <svg viewBox="0 0 400 225" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="60%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
          <linearGradient id="magicGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dark Magical Forest Sky */}
        <rect width="400" height="225" fill="url(#forestSky)" />

        {/* Moon / Magical Orb */}
        <circle cx="200" cy="50" r="30" fill="#fef08a" opacity="0.9" />
        <circle cx="200" cy="50" r="50" fill="#fef08a" opacity="0.25" />

        {/* Silhouetted Ancient Trees */}
        <rect x="20" y="40" width="35" height="185" fill="#0f172a" rx="4" />
        <circle cx="37" cy="40" r="45" fill="#064e3b" />
        <rect x="340" y="30" width="40" height="195" fill="#0f172a" rx="4" />
        <circle cx="360" cy="35" r="55" fill="#064e3b" />

        {/* Forest Floor */}
        <ellipse cx="200" cy="220" rx="220" ry="50" fill="#065f46" />
        <ellipse cx="200" cy="210" rx="180" ry="35" fill="#047857" />

        {/* Glowing Mushrooms & Fireflies */}
        <circle cx="90" cy="185" r="5" fill="#f43f5e" />
        <rect x="88" y="190" width="4" height="8" fill="#f3e8ff" />

        <circle cx="300" cy="190" r="6" fill="#38bdf8" />
        <rect x="298" y="196" width="4" height="8" fill="#f3e8ff" />

        {/* Fireflies floating */}
        <circle cx="120" cy="120" r="3" fill="#fef08a" />
        <circle cx="280" cy="110" r="3.5" fill="#fde047" />
        <circle cx="160" cy="150" r="2.5" fill="#a7f3d0" />
        <circle cx="230" cy="140" r="3" fill="#fde047" />

        {/* Central Friendly Creature Silhouette with glowing eyes */}
        <ellipse cx="200" cy="170" rx="28" ry="24" fill="#3b0764" />
        <circle cx="200" cy="142" r="18" fill="#581c87" />
        {/* Cute Ears & Horns */}
        <polygon points="186,132 178,110 192,126" fill="#fde047" />
        <polygon points="214,132 222,110 208,126" fill="#fde047" />
        {/* Glowing Eyes */}
        <circle cx="193" cy="140" r="3.5" fill="#fef08a" />
        <circle cx="207" cy="140" r="3.5" fill="#fef08a" />
      </svg>
    );
  }

  if (panelNumber === 3) {
    // Scene 3: The Climax (Dramatic Storm & Arcane Lightning)
    return (
      <svg viewBox="0 0 400 225" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="stormSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="lightningGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Storm Sky */}
        <rect width="400" height="225" fill="url(#stormSky)" />

        {/* Swirling Storm Clouds */}
        <circle cx="100" cy="40" r="60" fill="#1e1b4b" opacity="0.8" />
        <circle cx="200" cy="30" r="70" fill="#312e81" opacity="0.7" />
        <circle cx="300" cy="45" r="65" fill="#1e1b4b" opacity="0.8" />

        {/* Jagged Arcane Lightning Bolts */}
        <path d="M180 10 L160 70 L190 75 L150 140 L180 135 L140 190" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M250 20 L270 65 L245 70 L280 120" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Craggy Cliffs & Ancient Stone Ruins */}
        <polygon points="0,225 0,160 90,140 160,180 230,160 300,175 400,150 400,225" fill="#1e293b" />
        <polygon points="40,225 100,165 180,225" fill="#0f172a" />
        <polygon points="260,225 320,175 380,225" fill="#0f172a" />

        {/* Ancient Standing Runestones */}
        <rect x="70" y="110" width="16" height="50" fill="#334155" rx="2" />
        <rect x="310" y="120" width="18" height="55" fill="#334155" rx="2" />

        {/* Glowing Runes on Stones */}
        <line x1="78" y1="120" x2="78" y2="145" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="319" y1="130" x2="319" y2="155" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Scene 4: Victory & Sunset Discovery
  return (
    <svg viewBox="0 0 400 225" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="40%" stopColor="#fb923c" />
          <stop offset="80%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id="altarGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>

      {/* Radiant Sunset Sky */}
      <rect width="400" height="225" fill="url(#sunsetSky)" />

      {/* Huge Golden Sun sinking over the horizon */}
      <circle cx="200" cy="150" r="55" fill="#fef08a" />
      <circle cx="200" cy="150" r="80" fill="#fde047" opacity="0.3" />

      {/* Mountain Silhouettes */}
      <polygon points="0,225 60,130 140,225" fill="#7c2d12" opacity="0.7" />
      <polygon points="260,225 340,120 400,225" fill="#7c2d12" opacity="0.7" />

      {/* Heroic Altar / Stone Platform */}
      <ellipse cx="200" cy="205" rx="140" ry="30" fill="#451a03" />
      <rect x="150" y="165" width="100" height="40" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="3" />

      {/* Glowing Treasure Chest on Altar */}
      <rect x="175" y="145" width="50" height="30" rx="4" fill="#ca8a04" stroke="#713f12" strokeWidth="2" />
      <path d="M172 145 C172 135, 228 135, 228 145 Z" fill="#eab308" stroke="#713f12" strokeWidth="2" />
      
      {/* Light Beams from Chest */}
      <polygon points="200,140 140,20 170,10" fill="#fef08a" opacity="0.4" />
      <polygon points="200,140 230,10 260,20" fill="#fef08a" opacity="0.4" />

      {/* Sparkling Stars */}
      <circle cx="160" cy="110" r="3" fill="#ffffff" />
      <circle cx="240" cy="100" r="3.5" fill="#ffffff" />
      <circle cx="200" cy="70" r="4" fill="#ffffff" />
    </svg>
  );
};
