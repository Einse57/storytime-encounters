import React, { useState } from 'react';
import { useStoryStore } from '../stores/storyStore';
import lootChestImg from '../assets/loot_chest.webp';
import creatureBeastImg from '../assets/creature_beast.webp';
import twistVortexImg from '../assets/twist_vortex.webp';

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

  return (
    <div className="space-y-1.5">
      {/* 1. LOOT (Slightly Enlarged 34px Graphic Badge, Pure White Text) */}
      <div
        onClick={rollLoot}
        className="btn-tactile spark-card-text bg-gradient-to-r from-[#2c0e4a] via-[#1d0933] to-[#120520] border border-[#f59e0b] rounded-xl py-2 px-3 shadow-xs relative overflow-hidden flex items-center gap-3 cursor-pointer select-none"
        style={{ color: '#ffffff' }}
      >
        <div className="filigree-corner-tl text-amber-400" />
        <div className="filigree-corner-br text-amber-400" />

        {/* 34px Graphic Badge */}
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden border border-amber-400/80 bg-black/40 flex items-center justify-center shadow-xs"
          style={{ width: '34px', height: '34px', minWidth: '34px', minHeight: '34px' }}
        >
          <img
            src={lootChestImg}
            alt="Loot"
            width="34"
            height="34"
            style={{ width: '34px', height: '34px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 leading-none mb-1">
            <span
              className="font-serif font-black text-xs tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              LOOT
            </span>
            <span
              className="text-[10px] font-serif font-semibold tracking-wide uppercase opacity-90"
              style={{ color: '#ffffff' }}
            >
              {activeLoot ? `Rarity: ${activeLoot.rarity}` : 'Rarity: Mythic'}
            </span>
          </div>

          <p
            className="font-serif text-xs font-normal leading-snug line-clamp-1"
            style={{ color: '#ffffff' }}
          >
            {activeLoot ? (
              <>
                <strong style={{ color: '#ffffff' }} className="font-bold">
                  {activeLoot.name}:{' '}
                </strong>
                {activeLoot.description}
              </>
            ) : (
              'Shiny loot inside! Tap to uncover relics.'
            )}
          </p>
        </div>
      </div>

      {/* 2. CREATURE (Slightly Enlarged 34px Graphic Badge, Pure White Text) */}
      <div
        onClick={rollCreature}
        className="btn-tactile spark-card-text bg-gradient-to-r from-[#122e1b] via-[#0c2013] to-[#07140c] border border-[#22c55e] rounded-xl py-2 px-3 shadow-xs relative overflow-hidden flex items-center gap-3 cursor-pointer select-none"
        style={{ color: '#ffffff' }}
      >
        <div className="filigree-corner-tl text-emerald-400" />
        <div className="filigree-corner-br text-emerald-400" />

        {/* 34px Graphic Badge */}
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden border border-emerald-400/80 bg-black/40 flex items-center justify-center shadow-xs"
          style={{ width: '34px', height: '34px', minWidth: '34px', minHeight: '34px' }}
        >
          <img
            src={creatureBeastImg}
            alt="Creature"
            width="34"
            height="34"
            style={{ width: '34px', height: '34px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 leading-none mb-1">
            <span
              className="font-serif font-black text-xs tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              CREATURE
            </span>
            <span
              className="text-[10px] font-serif font-semibold tracking-wide uppercase opacity-90"
              style={{ color: '#ffffff' }}
            >
              {activeCreature ? `Demeanor: ${activeCreature.demeanor}` : 'HP: 45 / Level: 3'}
            </span>
          </div>

          <p
            className="font-serif text-xs font-normal leading-snug line-clamp-1"
            style={{ color: '#ffffff' }}
          >
            {activeCreature ? (
              <>
                <strong style={{ color: '#ffffff' }} className="font-bold">
                  {activeCreature.name}:{' '}
                </strong>
                {activeCreature.quirk}
              </>
            ) : (
              'A curious creature appears! Tap to encounter.'
            )}
          </p>
        </div>
      </div>

      {/* 3. TWIST (Slightly Enlarged 34px Graphic Badge, Pure White Text) */}
      <div
        onClick={rollTwist}
        className="btn-tactile spark-card-text bg-gradient-to-r from-[#092931] via-[#061c22] to-[#021014] border border-[#06b6d4] rounded-xl py-2 px-3 shadow-xs relative overflow-hidden flex items-center gap-3 cursor-pointer select-none"
        style={{ color: '#ffffff' }}
      >
        <div className="filigree-corner-tl text-cyan-400" />
        <div className="filigree-corner-br text-cyan-400" />

        {/* 34px Graphic Badge */}
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden border border-cyan-400/80 bg-black/40 flex items-center justify-center shadow-xs"
          style={{ width: '34px', height: '34px', minWidth: '34px', minHeight: '34px' }}
        >
          <img
            src={twistVortexImg}
            alt="Twist"
            width="34"
            height="34"
            style={{ width: '34px', height: '34px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 leading-none mb-1">
            <span
              className="font-serif font-black text-xs tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              TWIST
            </span>
            <span
              className="text-[10px] font-serif font-semibold tracking-wide uppercase opacity-90"
              style={{ color: '#ffffff' }}
            >
              {activeTwist ? activeTwist.complicationType.replace('_', ' ') : 'Unexpected Event'}
            </span>
          </div>

          <p
            className="font-serif text-xs font-normal leading-snug line-clamp-1"
            style={{ color: '#ffffff' }}
          >
            {activeTwist ? (
              <>
                <strong style={{ color: '#ffffff' }} className="font-bold">
                  {activeTwist.title}:{' '}
                </strong>
                {activeTwist.quickAction}
              </>
            ) : (
              'Chaos ensues! Tap to trigger sudden dramatic twist.'
            )}
          </p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex justify-between items-center px-1 pt-0.5">
        <button
          onClick={rollAllSparks}
          className="btn-tactile bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-700 hover:to-yellow-700 text-white font-serif font-bold text-xs py-1 px-3 rounded-lg shadow-xs cursor-pointer"
        >
          Roll All Sparks
        </button>

        <div className="flex items-center gap-2">
          {sparkHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs font-bold text-amber-950 hover:text-amber-800 cursor-pointer"
            >
              History ({sparkHistory.length})
            </button>
          )}

          {(activeLoot || activeCreature || activeTwist) && (
            <button
              onClick={clearSparks}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold cursor-pointer underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Spark History Drawer */}
      {showHistory && sparkHistory.length > 0 && (
        <div className="bg-white/90 border border-amber-300 rounded-lg p-2 space-y-1 max-h-36 overflow-y-auto">
          <div className="flex justify-between items-center border-b border-amber-100 pb-0.5">
            <span className="text-[10px] font-bold text-amber-950 uppercase">Sparks History</span>
            <button onClick={clearHistory} className="text-[9px] text-rose-600 hover:underline">
              Clear
            </button>
          </div>
          {sparkHistory.map((item) => (
            <div key={item.id} className="text-xs text-gray-800 flex justify-between gap-2 border-b border-gray-100 pb-0.5">
              <span className="font-bold">{item.title}:</span>
              <span className="text-gray-600 flex-1 truncate">{item.details}</span>
              <span className="text-[9px] text-gray-400">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
