import React, { useState } from 'react';
import { useStoryStore } from '../stores/storyStore';
import lootChestImg from '../assets/loot_chest.webp';
import creatureBeastImg from '../assets/creature_beast.webp';
import twistVortexImg from '../assets/twist_vortex.webp';
import scifiLootImg from '../assets/scifi_loot.webp';
import scifiCreatureImg from '../assets/scifi_creature.webp';
import scifiTwistImg from '../assets/scifi_twist.webp';

export const StorySparks: React.FC = () => {
  const {
    activeLoot,
    activeCreature,
    activeTwist,
    sparkHistory,
    rollLoot,
    rollCreature,
    rollTwist,
    clearSparks,
    clearHistory,
    currentPackId,
  } = useStoryStore();

  const [showHistory, setShowHistory] = useState(false);
  const isScifi = currentPackId === 'scifi-frontier';

  return (
    <div className="space-y-2">
      {/* 1. LOOT */}
      <div
        onClick={rollLoot}
        className={`btn-tactile spark-card-text rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full border-2 ${
          isScifi
            ? 'bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a101d] border-[#38bdf8]'
            : 'bg-gradient-to-r from-[#2c0e4a] via-[#1d0933] to-[#120520] border-[#f59e0b]'
        }`}
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Loot Spark"
      >
        <div className={`filigree-corner-tl ${isScifi ? 'text-cyan-400' : 'text-amber-400'}`} />
        <div className={`filigree-corner-br ${isScifi ? 'text-cyan-400' : 'text-amber-400'}`} />

        {/* 36px Graphic Badge */}
        <div
          className={`flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border bg-black/40 flex items-center justify-center shadow-xs ${
            isScifi ? 'border-cyan-400/80' : 'border-amber-400/80'
          }`}
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={isScifi ? scifiLootImg : lootChestImg}
            alt="Loot"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              {isScifi ? 'SALVAGE' : 'LOOT'}
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isScifi
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30'
                  : 'bg-white/20 border-white/30'
              }`}
              style={{ color: '#ffffff' }}
            >
              {activeLoot ? `Rarity: ${activeLoot.rarity}` : isScifi ? 'Class: Military' : 'Rarity: Mythic'}
            </span>
          </div>

          <p
            className="font-serif text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal mt-0.5"
            style={{ color: '#ffffff' }}
          >
            {activeLoot ? (
              <>
                <strong style={{ color: '#ffffff' }} className="font-bold">
                  {activeLoot.name}:{' '}
                </strong>
                {activeLoot.description}
              </>
            ) : isScifi ? (
              'Armored cargo cache detected! Tap to crack salvage container.'
            ) : (
              'Shiny loot inside! Tap to uncover magic relics.'
            )}
          </p>
        </div>
      </div>

      {/* 2. CREATURE */}
      <div
        onClick={rollCreature}
        className={`btn-tactile spark-card-text rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full border-2 ${
          isScifi
            ? 'bg-gradient-to-r from-[#1b0a2a] via-[#11041c] to-[#08020e] border-[#c084fc]'
            : 'bg-gradient-to-r from-[#122e1b] via-[#0c2013] to-[#07140c] border-[#22c55e]'
        }`}
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Creature Spark"
      >
        <div className={`filigree-corner-tl ${isScifi ? 'text-purple-400' : 'text-emerald-400'}`} />
        <div className={`filigree-corner-br ${isScifi ? 'text-purple-400' : 'text-emerald-400'}`} />

        {/* 36px Graphic Badge */}
        <div
          className={`flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border bg-black/40 flex items-center justify-center shadow-xs ${
            isScifi ? 'border-purple-400/80' : 'border-emerald-400/80'
          }`}
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={isScifi ? scifiCreatureImg : creatureBeastImg}
            alt="Creature"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              {isScifi ? 'CONTACT' : 'CREATURE'}
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isScifi
                  ? 'bg-purple-500/20 text-purple-200 border-purple-400/30'
                  : 'bg-white/20 border-white/30'
              }`}
              style={{ color: '#ffffff' }}
            >
              {activeCreature ? `Demeanor: ${activeCreature.demeanor}` : isScifi ? 'Threat: Alpha' : 'HP: 45 / Level: 3'}
            </span>
          </div>

          <p
            className="font-serif text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal mt-0.5"
            style={{ color: '#ffffff' }}
          >
            {activeCreature ? (
              <>
                <strong style={{ color: '#ffffff' }} className="font-bold">
                  {activeCreature.name}:{' '}
                </strong>
                {activeCreature.quirk}
              </>
            ) : isScifi ? (
              'Unidentified lifeform signal detected! Tap to intercept contact.'
            ) : (
              'A curious creature appears! Tap to encounter.'
            )}
          </p>
        </div>
      </div>

      {/* 3. TWIST */}
      <div
        onClick={rollTwist}
        className={`btn-tactile spark-card-text rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full border-2 ${
          isScifi
            ? 'bg-gradient-to-r from-[#3b0712] via-[#24030a] to-[#120104] border-[#f43f5e]'
            : 'bg-gradient-to-r from-[#092931] via-[#061c22] to-[#021014] border-[#06b6d4]'
        }`}
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Twist Spark"
      >
        <div className={`filigree-corner-tl ${isScifi ? 'text-rose-400' : 'text-cyan-400'}`} />
        <div className={`filigree-corner-br ${isScifi ? 'text-rose-400' : 'text-cyan-400'}`} />

        {/* 36px Graphic Badge */}
        <div
          className={`flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border bg-black/40 flex items-center justify-center shadow-xs ${
            isScifi ? 'border-rose-400/80' : 'border-cyan-400/80'
          }`}
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={isScifi ? scifiTwistImg : twistVortexImg}
            alt="Twist"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              {isScifi ? 'ANOMALY' : 'TWIST'}
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isScifi
                  ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                  : 'bg-white/20 border-white/30'
              }`}
              style={{ color: '#ffffff' }}
            >
              {activeTwist ? activeTwist.complicationType.replace('_', ' ') : isScifi ? 'Red Alert' : 'Unexpected Event'}
            </span>
          </div>

          <p
            className="font-serif text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal mt-0.5"
            style={{ color: '#ffffff' }}
          >
            {activeTwist ? (
              <>
                <strong style={{ color: '#ffffff' }} className="font-bold">
                  {activeTwist.title}:{' '}
                </strong>
                {activeTwist.quickAction}
              </>
            ) : isScifi ? (
              'System failure siren blares! Tap to trigger sudden crisis.'
            ) : (
              'Chaos ensues! Tap to trigger sudden dramatic twist.'
            )}
          </p>
        </div>
      </div>

      {/* Spark Secondary Controls */}
      {(sparkHistory.length > 0 || activeLoot || activeCreature || activeTwist) && (
        <div className="flex justify-end items-center gap-3 px-1 pt-0.5">
          {sparkHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`text-xs font-bold hover:underline cursor-pointer ${
                isScifi ? 'text-cyan-300 hover:text-cyan-100' : 'text-amber-950 hover:text-amber-800'
              }`}
            >
              History ({sparkHistory.length})
            </button>
          )}

          {(activeLoot || activeCreature || activeTwist) && (
            <button
              onClick={clearSparks}
              className="text-xs text-rose-500 hover:text-rose-400 font-semibold cursor-pointer underline"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Spark History Drawer */}
      {showHistory && sparkHistory.length > 0 && (
        <div className={`rounded-lg p-2.5 space-y-1 max-h-36 overflow-y-auto border ${
          isScifi ? 'bg-slate-900/95 border-slate-700 text-slate-200' : 'bg-white/90 border-amber-300 text-gray-800'
        }`}>
          <div className="flex justify-between items-center border-b border-gray-700/50 pb-0.5">
            <span className={`text-[10px] font-bold uppercase ${isScifi ? 'text-cyan-300' : 'text-amber-950'}`}>
              History Log
            </span>
            <button onClick={clearHistory} className="text-[9px] text-rose-400 hover:underline">
              Clear
            </button>
          </div>
          {sparkHistory.map((item) => (
            <div key={item.id} className="text-xs flex justify-between gap-2 border-b border-gray-700/30 pb-0.5">
              <span className="font-bold">{item.title}:</span>
              <span className="opacity-80 flex-1 truncate">{item.details}</span>
              <span className="text-[10px] opacity-50">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
