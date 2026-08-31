import React, { useState } from 'react';
import { useStoryStore } from '../stores/storyStore';
import type { SparkRarity, CreatureDemeanor } from '../types/storyPack';

export const StorySparks: React.FC = () => {
  const {
    activeLoot,
    activeCreature,
    activeTwist,
    sparkHistory,
    rollLoot,
    rollCreature,
    rollTwist,
    rollAllSparks,
    clearSparks,
    clearHistory,
  } = useStoryStore();

  const [showHistory, setShowHistory] = useState(false);

  const getRarityBadge = (rarity: SparkRarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'very rare':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary':
        return 'bg-amber-100 text-amber-800 border-amber-400 font-bold';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDemeanorBadge = (demeanor: CreatureDemeanor) => {
    switch (demeanor) {
      case 'friendly':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'mischievous':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'mysterious':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'cautious':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hostile':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-parchment-300 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h2 className="text-2xl font-serif font-bold text-gray-800">1-Click Story Sparks</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Instant loot drops, colorful creature encounters, and sudden plot twists to weave directly into your story.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={rollAllSparks}
            className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5"
            title="Roll Loot, Creature, and Twist all at once"
          >
            <span>🎲</span>
            <span>Roll All Sparks</span>
          </button>
          
          {(activeLoot || activeCreature || activeTwist) && (
            <button
              onClick={clearSparks}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 transition-colors"
              title="Clear active sparks"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3 Sparks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Loot & Relic Spark */}
        <div className="flex flex-col bg-gradient-to-b from-amber-50/60 to-orange-50/30 rounded-xl border border-amber-200/80 p-5 relative overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <h3 className="font-serif font-bold text-amber-900 text-lg">Loot & Relic</h3>
            </div>
            <button
              onClick={rollLoot}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors flex items-center gap-1"
            >
              <span>🎲</span>
              <span>{activeLoot ? 'Reroll' : 'Drop Loot'}</span>
            </button>
          </div>

          {activeLoot ? (
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-serif font-bold text-gray-900 text-base leading-snug">
                    {activeLoot.name}
                  </h4>
                  <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRarityBadge(activeLoot.rarity)}`}>
                    {activeLoot.rarity}
                  </span>
                </div>
                <div className="text-xs text-amber-800 font-medium mb-2">
                  🏷️ {activeLoot.type}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {activeLoot.description}
                </p>
                <div className="bg-amber-100/70 border-l-3 border-amber-500 rounded-r p-2.5 text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold">✨ Story Hook: </span>
                  {activeLoot.storyHook}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400">
              <span className="text-3xl mb-2 opacity-50">🪙</span>
              <p className="text-sm">Click Drop Loot to reveal a mysterious discovery or treasure!</p>
            </div>
          )}
        </div>

        {/* 2. Surprise Creature / NPC Spark */}
        <div className="flex flex-col bg-gradient-to-b from-purple-50/60 to-indigo-50/30 rounded-xl border border-purple-200/80 p-5 relative overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐾</span>
              <h3 className="font-serif font-bold text-purple-900 text-lg">Creature & NPC</h3>
            </div>
            <button
              onClick={rollCreature}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors flex items-center gap-1"
            >
              <span>🎲</span>
              <span>{activeCreature ? 'Reroll' : 'Spawn Creature'}</span>
            </button>
          </div>

          {activeCreature ? (
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-serif font-bold text-gray-900 text-base leading-snug">
                    {activeCreature.name}
                  </h4>
                  <span className={`text-[11px] capitalize px-2 py-0.5 rounded-full border ${getDemeanorBadge(activeCreature.demeanor)}`}>
                    {activeCreature.demeanor}
                  </span>
                </div>
                <div className="text-xs text-purple-800 font-medium mb-2">
                  🧬 {activeCreature.category}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  <span className="font-medium text-purple-950">Quirk:</span> {activeCreature.quirk}
                </p>
                <div className="bg-purple-100/70 border-l-3 border-purple-500 rounded-r p-2.5 text-xs text-purple-900 leading-relaxed">
                  <span className="font-bold">🎭 Roleplay Hook: </span>
                  {activeCreature.narrativePrompt}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400">
              <span className="text-3xl mb-2 opacity-50">🧙</span>
              <p className="text-sm">Click Spawn Creature to introduce a memorable friend, foe, or guide!</p>
            </div>
          )}
        </div>

        {/* 3. Plot Twist / Complication Spark */}
        <div className="flex flex-col bg-gradient-to-b from-rose-50/60 to-red-50/30 rounded-xl border border-rose-200/80 p-5 relative overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h3 className="font-serif font-bold text-rose-900 text-lg">Plot Twist</h3>
            </div>
            <button
              onClick={rollTwist}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors flex items-center gap-1"
            >
              <span>🎲</span>
              <span>{activeTwist ? 'Reroll' : 'Trigger Twist'}</span>
            </button>
          </div>

          {activeTwist ? (
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-serif font-bold text-gray-900 text-base leading-snug">
                    {activeTwist.title}
                  </h4>
                  <span className="text-[11px] capitalize px-2 py-0.5 rounded-full border bg-rose-100 text-rose-800 border-rose-300">
                    {activeTwist.complicationType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {activeTwist.description}
                </p>
                <div className="bg-rose-100/70 border-l-3 border-rose-500 rounded-r p-2.5 text-xs text-rose-900 leading-relaxed">
                  <span className="font-bold">🎲 Quick Check / Action: </span>
                  {activeTwist.quickAction}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400">
              <span className="text-3xl mb-2 opacity-50">🌪️</span>
              <p className="text-sm">Click Trigger Twist when you need sudden tension or a surprise twist!</p>
            </div>
          )}
        </div>
      </div>

      {/* Spark History Toggle */}
      {sparkHistory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
            >
              <span>📜</span>
              <span>{showHistory ? 'Hide' : 'View'} Session Sparks History ({sparkHistory.length})</span>
              <span className="text-gray-400">{showHistory ? '▲' : '▼'}</span>
            </button>

            {showHistory && (
              <button
                onClick={clearHistory}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear History
              </button>
            )}
          </div>

          {showHistory && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
              {sparkHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs flex justify-between items-start gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">{item.title}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2">{item.details}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
