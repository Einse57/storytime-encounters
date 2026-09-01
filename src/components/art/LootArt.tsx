import React from 'react';
import type { SparkRarity } from '../../types/storyPack';

interface LootArtProps {
  rarity?: SparkRarity;
  type?: string;
  className?: string;
}

export const LootArt: React.FC<LootArtProps> = ({ rarity = 'common', className = 'w-16 h-16' }) => {
  const getGlowColor = () => {
    switch (rarity) {
      case 'legendary':
        return '#f59e0b';
      case 'very rare':
        return '#a855f7';
      case 'rare':
        return '#3b82f6';
      case 'uncommon':
        return '#10b981';
      default:
        return '#eab308';
    }
  };

  const glow = getGlowColor();

  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lootGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.6" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chestWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="50%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="chestGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="gemGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Ambient Back Glow */}
      <circle cx="60" cy="50" r="45" fill="url(#lootGlow)" />

      {/* Sparkle Stars */}
      <path d="M60 10 L62 18 L70 20 L62 22 L60 30 L58 22 L50 20 L58 18 Z" fill="#fef08a" opacity="0.9" />
      <path d="M22 25 L23 29 L27 30 L23 31 L22 35 L21 31 L17 30 L21 29 Z" fill="#fef08a" opacity="0.8" />
      <path d="M98 28 L99 32 L103 33 L99 34 L98 38 L97 34 L93 33 L97 32 Z" fill="#fef08a" opacity="0.8" />

      {/* Chest Base */}
      <rect x="25" y="45" width="70" height="42" rx="6" fill="url(#chestWood)" stroke="#271003" strokeWidth="2.5" />
      
      {/* Wood plank lines */}
      <line x1="25" y1="58" x2="95" y2="58" stroke="#451a03" strokeWidth="1.5" />
      <line x1="25" y1="72" x2="95" y2="72" stroke="#451a03" strokeWidth="1.5" />

      {/* Chest Lid (Open / Glowing) */}
      <path d="M20 45 C20 28, 100 28, 100 45 Z" fill="url(#chestWood)" stroke="#271003" strokeWidth="2.5" />
      
      {/* Gold Trim & Brackets */}
      <rect x="23" y="44" width="74" height="6" rx="2" fill="url(#chestGold)" stroke="#713f12" strokeWidth="1" />
      <rect x="35" y="32" width="7" height="55" rx="1.5" fill="url(#chestGold)" stroke="#713f12" strokeWidth="1" />
      <rect x="78" y="32" width="7" height="55" rx="1.5" fill="url(#chestGold)" stroke="#713f12" strokeWidth="1" />

      {/* Radiating Treasure Glow from Inside */}
      <ellipse cx="60" cy="46" rx="28" ry="10" fill="#fde047" opacity="0.8" />
      
      {/* Glowing Coins & Gems */}
      <circle cx="50" cy="45" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <circle cx="58" cy="43" r="4.5" fill="#fde047" stroke="#d97706" strokeWidth="1" />
      <circle cx="68" cy="45" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <circle cx="63" cy="40" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
      <circle cx="53" cy="40" r="3" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

      {/* Center Gem / Crest */}
      <polygon points="60,37 65,43 60,49 55,43" fill="url(#gemGradient)" stroke="#1e3a8a" strokeWidth="1" />

      {/* Center Lock Plate */}
      <rect x="54" y="52" width="12" height="16" rx="2" fill="url(#chestGold)" stroke="#713f12" strokeWidth="1" />
      <circle cx="60" cy="58" r="2.5" fill="#271003" />
      <polygon points="59,58 61,58 61.5,64 58.5,64" fill="#271003" />

      {/* Rivets */}
      <circle cx="38.5" cy="47" r="1" fill="#fef08a" />
      <circle cx="38.5" cy="65" r="1" fill="#fef08a" />
      <circle cx="38.5" cy="80" r="1" fill="#fef08a" />
      <circle cx="81.5" cy="47" r="1" fill="#fef08a" />
      <circle cx="81.5" cy="65" r="1" fill="#fef08a" />
      <circle cx="81.5" cy="80" r="1" fill="#fef08a" />
    </svg>
  );
};
