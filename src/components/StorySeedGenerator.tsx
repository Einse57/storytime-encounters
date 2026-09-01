import React, { useState, useEffect } from 'react';
import { useStoryStore } from '../stores/storyStore';

export const StorySeedGenerator: React.FC = () => {
  const seed = useStoryStore((s) => s.seed);
  const randomizeSeed = useStoryStore((s) => s.randomizeSeed);
  const toggleLock = useStoryStore((s) => s.toggleLock);
  const currentPackId = useStoryStore((s) => s.currentPackId);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const current = useStoryStore.getState().seed;
    if (!current.setting && !current.conflict && !current.hook) {
      useStoryStore.getState().randomizeSeed();
    }
  }, [currentPackId]);

  const handleRandomize = () => {
    setIsAnimating(true);
    randomizeSeed();
    setTimeout(() => setIsAnimating(false), 250);
  };

  return (
    <div className="bg-[#fcf7ec] rounded-xl shadow-xs border border-[#d9c49e] p-3 sm:p-4 relative overflow-hidden max-w-full">
      <div className="filigree-corner-tl text-amber-700" />
      <div className="filigree-corner-br text-amber-700" />

      {/* Header Row */}
      <div className="flex justify-between items-center mb-2.5">
        <div>
          <h2 className="text-xs sm:text-sm font-serif font-black uppercase tracking-widest text-amber-950">
            STORY SEED
          </h2>
          <p className="text-[11px] text-amber-800 font-serif italic">
            Random Encounter Generator
          </p>
        </div>

        {/* Bronze Button with 🔒 Lock Indicator */}
        <button
          onClick={handleRandomize}
          className="btn-tactile bg-gradient-to-b from-[#b45309] via-[#92400e] to-[#78350f] hover:from-[#d97706] hover:to-[#92400e] text-amber-100 font-serif font-bold text-xs py-1.5 px-3.5 rounded-full border border-[#fde68a]/70 shadow-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          aria-label="Generate new story seed"
        >
          <span className="text-xs">🔒</span>
          <span className="tracking-wide uppercase font-black text-[10px] sm:text-[11px]">
            RANDOM
          </span>
        </button>
      </div>

      {/* 3 Seed Elements - Strictly Constrained & Auto-Wrapping */}
      <div className={`space-y-2 transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
        {/* Setting */}
        <div className={`bg-white/90 border ${seed.isSettingLocked ? 'border-amber-500 bg-amber-50/95 ring-1 ring-amber-400' : 'border-amber-200/80'} rounded-lg p-2.5 flex justify-between items-start gap-2.5 overflow-hidden max-w-full transition-all`}>
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">
                Setting
              </span>
              {seed.isSettingLocked && (
                <span className="text-[8px] bg-amber-400 text-amber-950 px-1 py-0.2 rounded font-black uppercase">
                  Locked
                </span>
              )}
            </div>
            <p className="text-gray-900 font-serif text-xs sm:text-sm leading-snug break-words whitespace-normal">
              {seed.setting || 'Generating setting...'}
            </p>
          </div>
          <button
            onClick={() => toggleLock('setting')}
            className={`btn-tactile p-1.5 rounded-md text-xs transition-all flex-shrink-0 cursor-pointer self-center ${
              seed.isSettingLocked
                ? 'bg-amber-300 text-amber-950 shadow-inner'
                : 'text-gray-400 hover:text-gray-700 bg-amber-100/60 border border-amber-200'
            }`}
            title={seed.isSettingLocked ? 'Unlock Setting' : 'Lock Setting'}
          >
            {seed.isSettingLocked ? '🔒' : '🔓'}
          </button>
        </div>

        {/* Conflict */}
        <div className={`bg-white/90 border ${seed.isConflictLocked ? 'border-rose-500 bg-rose-50/95 ring-1 ring-rose-400' : 'border-rose-200/80'} rounded-lg p-2.5 flex justify-between items-start gap-2.5 overflow-hidden max-w-full transition-all`}>
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider">
                Conflict
              </span>
              {seed.isConflictLocked && (
                <span className="text-[8px] bg-rose-400 text-rose-950 px-1 py-0.2 rounded font-black uppercase">
                  Locked
                </span>
              )}
            </div>
            <p className="text-gray-900 font-serif text-xs sm:text-sm leading-snug break-words whitespace-normal">
              {seed.conflict || 'Generating conflict...'}
            </p>
          </div>
          <button
            onClick={() => toggleLock('conflict')}
            className={`btn-tactile p-1.5 rounded-md text-xs transition-all flex-shrink-0 cursor-pointer self-center ${
              seed.isConflictLocked
                ? 'bg-rose-300 text-rose-950 shadow-inner'
                : 'text-gray-400 hover:text-gray-700 bg-rose-100/60 border border-rose-200'
            }`}
            title={seed.isConflictLocked ? 'Unlock Conflict' : 'Lock Conflict'}
          >
            {seed.isConflictLocked ? '🔒' : '🔓'}
          </button>
        </div>

        {/* Hook */}
        <div className={`bg-white/90 border ${seed.isHookLocked ? 'border-blue-500 bg-blue-50/95 ring-1 ring-blue-400' : 'border-blue-200/80'} rounded-lg p-2.5 flex justify-between items-start gap-2.5 overflow-hidden max-w-full transition-all`}>
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">
                Hook
              </span>
              {seed.isHookLocked && (
                <span className="text-[8px] bg-blue-400 text-blue-950 px-1 py-0.2 rounded font-black uppercase">
                  Locked
                </span>
              )}
            </div>
            <p className="text-gray-900 font-serif text-xs sm:text-sm leading-snug break-words whitespace-normal">
              {seed.hook || 'Generating hook...'}
            </p>
          </div>
          <button
            onClick={() => toggleLock('hook')}
            className={`btn-tactile p-1.5 rounded-md text-xs transition-all flex-shrink-0 cursor-pointer self-center ${
              seed.isHookLocked
                ? 'bg-blue-300 text-blue-950 shadow-inner'
                : 'text-gray-400 hover:text-gray-700 bg-blue-100/60 border border-blue-200'
            }`}
            title={seed.isHookLocked ? 'Unlock Hook' : 'Lock Hook'}
          >
            {seed.isHookLocked ? '🔒' : '🔓'}
          </button>
        </div>
      </div>
    </div>
  );
};
