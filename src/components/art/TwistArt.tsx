import React from 'react';

interface TwistArtProps {
  complicationType?: string;
  className?: string;
}

export const TwistArt: React.FC<TwistArtProps> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="swirlGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id="swirlGrad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>

      {/* Ambient Pulsing Glow */}
      <circle cx="60" cy="50" r="46" fill="url(#portalGlow)" />

      {/* Outer Runic Magic Circle */}
      <circle cx="60" cy="50" r="40" stroke="#fda4af" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
      <circle cx="60" cy="50" r="34" stroke="#d8b4fe" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Swirling Vortex Spiral Arms */}
      <path
        d="M60 50 C40 40, 20 60, 30 80 C40 95, 75 90, 85 75 C95 60, 90 35, 75 25 C60 15, 35 25, 28 45"
        stroke="url(#swirlGrad1)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M60 50 C75 60, 95 40, 85 20 C75 5, 40 10, 30 25 C20 40, 25 65, 40 75 C55 85, 80 75, 87 55"
        stroke="url(#swirlGrad2)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Dynamic Lightning Sparkles / Bolts */}
      <path d="M45 28 L40 38 L48 36 L43 48" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M78 62 L73 70 L80 69 L76 80" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Center Event Horizon Core */}
      <circle cx="60" cy="50" r="12" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="2" />
      <circle cx="60" cy="50" r="7" fill="#ffffff" />
      <circle cx="60" cy="50" r="4" fill="#fde047" />

      {/* Sparkle Particles */}
      <circle cx="28" cy="30" r="2" fill="#fef08a" />
      <circle cx="92" cy="34" r="2.5" fill="#fef08a" />
      <circle cx="34" cy="74" r="2" fill="#c084fc" />
      <circle cx="86" cy="70" r="2.5" fill="#fda4af" />
    </svg>
  );
};
