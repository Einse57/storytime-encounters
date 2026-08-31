import React, { useState } from 'react';
import { useDiceStore, type DiceRoll } from '../stores/diceStore';
import type { Entity } from '../stores/encounterStore';

const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100];

const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

interface DiceRollerProps {
  isSessionActive: boolean;
  entities: Entity[];
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ isSessionActive, entities }) => {
  const [dieType, setDieType] = useState(20);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [selectedModifier, setSelectedModifier] = useState(0);
  
  const { rollHistory, addRoll, clearHistory } = useDiceStore();

  // Get player entities with abilities
  const players = entities.filter(e => e.type === 'player' && e.abilityScores);

  const executeRoll = (q: number, d: number, mod = 0, desc = '') => {
    const results: number[] = [];
    for (let i = 0; i < q; i++) {
      results.push(Math.floor(Math.random() * d) + 1);
    }
    
    const total = results.reduce((sum, val) => sum + val, 0) + mod;
    
    const roll: DiceRoll = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      dieType: d,
      quantity: q,
      modifier: mod,
      results,
      total,
      description: desc || undefined,
    };
    
    addRoll(roll);
  };

  const handleCustomRoll = () => {
    executeRoll(quantity, dieType, selectedModifier, description);
    setDescription('');
    setSelectedModifier(0);
  };

  const handleQuickRoll = (q: number, d: number, label: string) => {
    executeRoll(q, d, selectedModifier, label);
  };

  const formatRollNotation = (roll: DiceRoll) => {
    const notation = `${roll.quantity}d${roll.dieType}${
      roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier < 0 ? roll.modifier : ''
    }`;
    return notation;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-parchment-300 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎲</span>
          <h2 className="text-2xl font-serif font-bold text-gray-800">Dice Roller</h2>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          Quick & Custom
        </span>
      </div>

      {/* 1-Click Quick Roll Presets */}
      <div className="mb-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200/80 rounded-xl p-3.5">
        <label className="block text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">
          ⚡ 1-Click Quick Rolls
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          <button
            onClick={() => handleQuickRoll(1, 20, 'd20 Action Roll')}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2 px-2 rounded-lg text-sm transition-all shadow-sm flex flex-col items-center"
            title="Roll 1d20"
          >
            <span>d20</span>
            <span className="text-[10px] font-normal opacity-80">Action</span>
          </button>

          <button
            onClick={() => handleQuickRoll(2, 6, '2d6 Check')}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-2 px-2 rounded-lg text-sm transition-all shadow-sm flex flex-col items-center"
            title="Roll 2d6"
          >
            <span>2d6</span>
            <span className="text-[10px] font-normal opacity-80">Check</span>
          </button>

          <button
            onClick={() => handleQuickRoll(1, 6, '1d6')}
            className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-2 px-2 rounded-lg text-sm transition-all shadow-2xs flex flex-col items-center"
          >
            <span>d6</span>
            <span className="text-[10px] font-normal text-gray-500">Standard</span>
          </button>

          <button
            onClick={() => handleQuickRoll(1, 8, '1d8')}
            className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-2 px-2 rounded-lg text-sm transition-all shadow-2xs flex flex-col items-center"
          >
            <span>d8</span>
            <span className="text-[10px] font-normal text-gray-500">Damage</span>
          </button>

          <button
            onClick={() => handleQuickRoll(1, 10, '1d10')}
            className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-2 px-2 rounded-lg text-sm transition-all shadow-2xs flex flex-col items-center"
          >
            <span>d10</span>
            <span className="text-[10px] font-normal text-gray-500">Dice</span>
          </button>

          <button
            onClick={() => handleQuickRoll(1, 12, '1d12')}
            className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-2 px-2 rounded-lg text-sm transition-all shadow-2xs flex flex-col items-center"
          >
            <span>d12</span>
            <span className="text-[10px] font-normal text-gray-500">Heavy</span>
          </button>

          <button
            onClick={() => handleQuickRoll(1, 100, 'd100 Percentile')}
            className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-2 px-2 rounded-lg text-sm transition-all shadow-2xs flex flex-col items-center col-span-2 sm:col-span-1"
          >
            <span>d100</span>
            <span className="text-[10px] font-normal text-gray-500">Percent</span>
          </button>
        </div>
      </div>
      
      {/* Custom Roll Controls */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Die Type
            </label>
            <select
              value={dieType}
              onChange={(e) => setDieType(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              {DIE_TYPES.map((die) => (
                <option key={die} value={die}>
                  d{die}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Modifier Dropdown - Only visible in session with players */}
        {isSessionActive && players.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Ability Modifier (Optional)
            </label>
            <select
              value={selectedModifier}
              onChange={(e) => setSelectedModifier(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option value={0}>No modifier</option>
              {players.map((player) =>
                (['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((ability) => {
                  const score = player.abilityScores![ability];
                  const modifier = calculateModifier(score);
                  return (
                    <option key={`${player.id}-${ability}`} value={modifier}>
                      {player.name} - {ability.toUpperCase()} ({modifier >= 0 ? '+' : ''}{modifier})
                    </option>
                  );
                })
              )}
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Description / Reason (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Sneak past guard, Search ancient chest..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <button
          onClick={handleCustomRoll}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2"
        >
          <span>🎲</span>
          <span>
            Roll {quantity}d{dieType}
            {selectedModifier !== 0 && (selectedModifier > 0 ? `+${selectedModifier}` : selectedModifier)}
          </span>
        </button>
        
        {/* d20 Storyteller Guide */}
        {dieType === 20 && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
            <p className="font-bold text-amber-950 mb-1">📖 Storyteller's d20 Quick Reference:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center mt-1">
              <span className="bg-red-100/90 text-red-800 px-1.5 py-0.5 rounded font-medium">1-4: Catastrophe</span>
              <span className="bg-orange-100/90 text-orange-800 px-1.5 py-0.5 rounded font-medium">5-9: Setback</span>
              <span className="bg-yellow-100/90 text-yellow-800 px-1.5 py-0.5 rounded font-medium">10-14: Success with a Catch</span>
              <span className="bg-emerald-100/90 text-emerald-800 px-1.5 py-0.5 rounded font-medium">15-19: Great Success</span>
              <span className="bg-purple-100/90 text-purple-800 px-1.5 py-0.5 rounded font-bold col-span-2 sm:col-span-1">20: Epic Triumph!</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Roll History */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            📜 Roll History ({rollHistory.length})
          </h3>
          {rollHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-0.5 rounded transition-colors"
              title="Clear roll history"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {rollHistory.length === 0 ? (
            <p className="text-gray-400 text-xs italic text-center py-4">No dice rolled yet</p>
          ) : (
            rollHistory.map((roll) => {
              const isCrit = roll.dieType === 20 && roll.results[0] === 20;
              const isFumble = roll.dieType === 20 && roll.results[0] === 1;

              return (
                <div
                  key={roll.id}
                  className={`border rounded-lg p-2.5 transition-all ${
                    isCrit
                      ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-200'
                      : isFumble
                      ? 'bg-red-50 border-red-300'
                      : 'bg-parchment-100/80 border-parchment-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="font-mono text-base font-bold text-gray-800 flex items-center gap-1.5">
                      <span>{formatRollNotation(roll)} =</span>
                      <span className={`px-1.5 py-0.2 rounded ${
                        isCrit ? 'bg-purple-600 text-white' : isFumble ? 'bg-red-600 text-white' : 'text-blue-700'
                      }`}>
                        {roll.total}
                      </span>
                      {isCrit && <span className="text-xs">✨ NAT 20!</span>}
                      {isFumble && <span className="text-xs">💥 NAT 1!</span>}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  {roll.description && (
                    <p className="text-xs text-gray-600 italic mb-0.5">{roll.description}</p>
                  )}
                  <div className="text-[11px] text-gray-500 font-mono">
                    Individual: [{roll.results.join(', ')}]
                    {roll.modifier !== 0 && ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}`}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
