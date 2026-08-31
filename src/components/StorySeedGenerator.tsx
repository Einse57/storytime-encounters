import React, { useState, useEffect } from 'react';
import { useStoryStore } from '../stores/storyStore';

export const StorySeedGenerator: React.FC = () => {
  const seed = useStoryStore((s) => s.seed);
  const randomizeSeed = useStoryStore((s) => s.randomizeSeed);
  const toggleLock = useStoryStore((s) => s.toggleLock);
  const currentPackId = useStoryStore((s) => s.currentPackId);
  const getCurrentPack = useStoryStore((s) => s.getCurrentPack);

  const [isAnimating, setIsAnimating] = useState(false);

  const pack = getCurrentPack();

  // Generate initial seed on mount if empty
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
    <div className="bg-white rounded-xl shadow-md border border-parchment-300 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{pack.icon}</span>
            <h2 className="text-2xl font-serif font-bold text-gray-800">Story Seed</h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              {pack.title}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Lock any element you like with the lock button, then randomize the rest!
          </p>
        </div>

        <button
          onClick={handleRandomize}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-1.5"
          aria-label="Generate new story seed"
        >
          <span>🎲</span>
          <span>Randomize Seed</span>
        </button>
      </div>

      {/* 3 Story Seed Elements */}
      <div className={`space-y-3.5 transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
        {/* Setting */}
        <div className={`bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 ${seed.isSettingLocked ? 'border-amber-600 ring-1 ring-amber-300' : 'border-amber-500'} rounded-r-lg p-4 transition-all duration-200 flex justify-between items-start gap-3`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-amber-900 uppercase tracking-wide">
                📍 Setting
              </span>
              {seed.isSettingLocked && (
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                  LOCKED
                </span>
              )}
            </div>
            <p className="text-gray-800 font-serif text-lg leading-relaxed capitalize">
              {seed.setting || 'Generating setting...'}
            </p>
          </div>
          <button
            onClick={() => toggleLock('setting')}
            className={`p-1.5 rounded-md text-sm transition-colors ${
              seed.isSettingLocked
                ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                : 'text-gray-400 hover:text-gray-700 hover:bg-amber-100'
            }`}
            title={seed.isSettingLocked ? 'Unlock Setting' : 'Lock Setting'}
          >
            {seed.isSettingLocked ? '🔒' : '🔓'}
          </button>
        </div>

        {/* Conflict */}
        <div className={`bg-gradient-to-r from-red-50 to-rose-50 border-l-4 ${seed.isConflictLocked ? 'border-red-600 ring-1 ring-red-300' : 'border-red-500'} rounded-r-lg p-4 transition-all duration-200 flex justify-between items-start gap-3`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-red-900 uppercase tracking-wide">
                ⚔️ Conflict
              </span>
              {seed.isConflictLocked && (
                <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded font-semibold">
                  LOCKED
                </span>
              )}
            </div>
            <p className="text-gray-800 font-serif text-lg leading-relaxed">
              {seed.conflict || 'Generating conflict...'}
            </p>
          </div>
          <button
            onClick={() => toggleLock('conflict')}
            className={`p-1.5 rounded-md text-sm transition-colors ${
              seed.isConflictLocked
                ? 'bg-red-200 text-red-900 hover:bg-red-300'
                : 'text-gray-400 hover:text-gray-700 hover:bg-red-100'
            }`}
            title={seed.isConflictLocked ? 'Unlock Conflict' : 'Lock Conflict'}
          >
            {seed.isConflictLocked ? '🔒' : '🔓'}
          </button>
        </div>

        {/* Hook */}
        <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 ${seed.isHookLocked ? 'border-blue-600 ring-1 ring-blue-300' : 'border-blue-500'} rounded-r-lg p-4 transition-all duration-200 flex justify-between items-start gap-3`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
                🎣 Hook
              </span>
              {seed.isHookLocked && (
                <span className="text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded font-semibold">
                  LOCKED
                </span>
              )}
            </div>
            <p className="text-gray-800 font-serif text-lg leading-relaxed">
              {seed.hook || 'Generating hook...'}
            </p>
          </div>
          <button
            onClick={() => toggleLock('hook')}
            className={`p-1.5 rounded-md text-sm transition-colors ${
              seed.isHookLocked
                ? 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                : 'text-gray-400 hover:text-gray-700 hover:bg-blue-100'
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
