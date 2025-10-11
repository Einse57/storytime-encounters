import React, { useState, useEffect } from 'react';
import storySeedsData from '../data/storySeeds.json';

interface StorySeeds {
  settings: string[];
  conflicts: string[];
  hooks: string[];
}

const storySeeds = storySeedsData as StorySeeds;

export const StorySeedGenerator: React.FC = () => {
  const [setting, setSetting] = useState('');
  const [conflict, setConflict] = useState('');
  const [hook, setHook] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const generateSeed = () => {
    setIsAnimating(true);
    
    const randomSetting = storySeeds.settings[Math.floor(Math.random() * storySeeds.settings.length)];
    const randomConflict = storySeeds.conflicts[Math.floor(Math.random() * storySeeds.conflicts.length)];
    const randomHook = storySeeds.hooks[Math.floor(Math.random() * storySeeds.hooks.length)];

    setSetting(randomSetting);
    setConflict(randomConflict);
    setHook(randomHook);

    setTimeout(() => setIsAnimating(false), 300);
  };

  // Generate initial seed on mount
  useEffect(() => {
    generateSeed();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Story Seed</h2>
        <button
          onClick={generateSeed}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md transform hover:scale-105"
          aria-label="Generate new story seed"
        >
          🎲 Randomize
        </button>
      </div>

      <div className={`space-y-4 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
        {/* Setting */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-r-lg p-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-1 uppercase tracking-wide">
            📍 Setting
          </h3>
          <p className="text-gray-800 font-serif text-lg leading-relaxed">
            {setting}
          </p>
        </div>

        {/* Conflict */}
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-r-lg p-4">
          <h3 className="text-sm font-semibold text-red-900 mb-1 uppercase tracking-wide">
            ⚔️ Conflict
          </h3>
          <p className="text-gray-800 font-serif text-lg leading-relaxed">
            {conflict}
          </p>
        </div>

        {/* Hook */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-1 uppercase tracking-wide">
            🎣 Hook
          </h3>
          <p className="text-gray-800 font-serif text-lg leading-relaxed">
            {hook}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center italic">
          Your adventure begins...
        </p>
      </div>
    </div>
  );
};
