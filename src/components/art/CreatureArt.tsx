import React from 'react';

interface CreatureArtProps {
  category?: string;
  demeanor?: string;
  className?: string;
}

export const CreatureArt: React.FC<CreatureArtProps> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="creatureGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="creatureFur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <linearGradient id="hornGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <linearGradient id="wingGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Aura Glow */}
      <circle cx="60" cy="52" r="45" fill="url(#creatureGlow)" />

      {/* Little Fairy Wings */}
      <path d="M40 45 C20 30, 15 55, 38 56 Z" fill="url(#wingGradient)" stroke="#7e22ce" strokeWidth="1.5" />
      <path d="M80 45 C100 30, 105 55, 82 56 Z" fill="url(#wingGradient)" stroke="#7e22ce" strokeWidth="1.5" />

      {/* Creature Body */}
      <ellipse cx="60" cy="62" rx="26" ry="24" fill="url(#creatureFur)" stroke="#3b0764" strokeWidth="2.5" />
      
      {/* Belly Patch */}
      <ellipse cx="60" cy="66" rx="16" ry="14" fill="#f3e8ff" />

      {/* Cute Horns */}
      <path d="M44 38 C35 24, 28 20, 32 12 C38 18, 45 28, 48 35 Z" fill="url(#hornGold)" stroke="#713f12" strokeWidth="1.5" />
      <path d="M76 38 C85 24, 92 20, 88 12 C82 18, 75 28, 72 35 Z" fill="url(#hornGold)" stroke="#713f12" strokeWidth="1.5" />

      {/* Ears */}
      <ellipse cx="36" cy="42" rx="6" ry="10" transform="rotate(-30 36 42)" fill="url(#creatureFur)" stroke="#3b0764" strokeWidth="2" />
      <ellipse cx="36" cy="42" rx="3.5" ry="6.5" transform="rotate(-30 36 42)" fill="#f472b6" />

      <ellipse cx="84" cy="42" rx="6" ry="10" transform="rotate(30 84 42)" fill="url(#creatureFur)" stroke="#3b0764" strokeWidth="2" />
      <ellipse cx="84" cy="42" rx="3.5" ry="6.5" transform="rotate(30 84 42)" fill="#f472b6" />

      {/* Head */}
      <ellipse cx="60" cy="46" rx="22" ry="19" fill="url(#creatureFur)" stroke="#3b0764" strokeWidth="2.5" />

      {/* Big Expressive Anime/Storybook Eyes */}
      <ellipse cx="50" cy="44" rx="5.5" ry="7" fill="#1e1b4b" />
      <circle cx="48.5" cy="42" r="2.5" fill="#ffffff" />
      <circle cx="52" cy="47" r="1.2" fill="#ffffff" />

      <ellipse cx="70" cy="44" rx="5.5" ry="7" fill="#1e1b4b" />
      <circle cx="68.5" cy="42" r="2.5" fill="#ffffff" />
      <circle cx="72" cy="47" r="1.2" fill="#ffffff" />

      {/* Cute Snout & Smile */}
      <ellipse cx="60" cy="51" rx="4" ry="3" fill="#f472b6" />
      <path d="M57 54 Q60 57 63 54" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" />

      {/* Rosy Cheeks */}
      <ellipse cx="43" cy="50" rx="3.5" ry="2" fill="#f472b6" opacity="0.6" />
      <ellipse cx="77" cy="50" rx="3.5" ry="2" fill="#f472b6" opacity="0.6" />

      {/* Sparkles around head */}
      <path d="M60 16 L61.5 20 L65 21 L61.5 22 L60 26 L58.5 22 L55 21 L58.5 20 Z" fill="#fde047" />
      <path d="M26 50 L27 52.5 L30 53 L27 53.5 L26 56 L25 53.5 L22 53 L25 52.5 Z" fill="#fde047" />
      <path d="M94 50 L95 52.5 L98 53 L95 53.5 L94 56 L93 53.5 L90 53 L93 52.5 Z" fill="#fde047" />
    </svg>
  );
};
