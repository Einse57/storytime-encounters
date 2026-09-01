import React, { useState } from 'react';
import { useDiceStore, type DiceRoll } from '../stores/diceStore';
import { useStoryStore } from '../stores/storyStore';

export const DiceRoller: React.FC = () => {
  const { rollHistory, addRoll, clearHistory } = useDiceStore();
  const currentPackId = useStoryStore((s) => s.currentPackId);
  const isScifi = currentPackId === 'scifi-frontier';

  const [lastD6, setLastD6] = useState<number | null>(null);
  const [lastD10, setLastD10] = useState<number | null>(null);
  const [lastD20, setLastD20] = useState<number | null>(null);
  const [showAllDice, setShowAllDice] = useState(false);

  const executeRoll = (q: number, d: number, label: string) => {
    const results: number[] = [];
    for (let i = 0; i < q; i++) {
      results.push(Math.floor(Math.random() * d) + 1);
    }
    const total = results.reduce((sum, val) => sum + val, 0);

    if (d === 6) setLastD6(total);
    if (d === 10) setLastD10(total);
    if (d === 20) setLastD20(total);

    const roll: DiceRoll = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      dieType: d,
      quantity: q,
      modifier: 0,
      results,
      total,
      description: label,
    };
    addRoll(roll);
  };

  return (
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="flex justify-between items-center px-1">
        <h3 className={`font-serif font-extrabold text-sm sm:text-base tracking-tight ${
          isScifi ? 'text-white' : 'text-gray-900'
        }`}>
          1-Tap Quick Dice
        </h3>
        <button
          onClick={() => setShowAllDice(!showAllDice)}
          className={`text-[11px] font-bold underline cursor-pointer ${
            isScifi ? 'text-cyan-400 hover:text-cyan-200' : 'text-amber-900 hover:text-amber-700'
          }`}
        >
          {showAllDice ? 'Fewer Dice' : '+ More Dice'}
        </button>
      </div>

      {/* Row of 3 Chunky 3D Dice Buttons (D6, D10, D20) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* D6 Red Button */}
        <button
          onClick={() => executeRoll(1, 6, '1d6 Standard')}
          className="dice-btn-3d dice-btn-red py-3 sm:py-3.5 px-2 flex flex-col items-center justify-center cursor-pointer select-none"
          style={{ color: '#ffffff' }}
          aria-label="Roll D6"
        >
          <span
            className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            D6
          </span>
          <span
            className="font-mono font-black text-xl sm:text-2xl mt-0.5 drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            {lastD6 !== null ? lastD6 : '—'}
          </span>
        </button>

        {/* D10 Blue Button */}
        <button
          onClick={() => executeRoll(1, 10, '1d10 Check')}
          className="dice-btn-3d dice-btn-blue py-3 sm:py-3.5 px-2 flex flex-col items-center justify-center cursor-pointer select-none"
          style={{ color: '#ffffff' }}
          aria-label="Roll D10"
        >
          <span
            className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            D10
          </span>
          <span
            className="font-mono font-black text-xl sm:text-2xl mt-0.5 drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            {lastD10 !== null ? lastD10 : '—'}
          </span>
        </button>

        {/* D20 Amber Button - Bold White Text */}
        <button
          onClick={() => executeRoll(1, 20, '1d20 Action')}
          className="dice-btn-3d dice-btn-gold py-3 sm:py-3.5 px-2 flex flex-col items-center justify-center cursor-pointer select-none ring-2 ring-amber-300"
          style={{ color: '#ffffff' }}
          aria-label="Roll D20"
        >
          <span
            className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            D20
          </span>
          <span
            className="font-mono font-black text-xl sm:text-2xl mt-0.5 drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            {lastD20 !== null ? lastD20 : '—'}
          </span>
        </button>
      </div>

      {/* Expanded Extra Dice if Toggled - Pure White Text */}
      {showAllDice && (
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => executeRoll(1, 4, '1d4 Minor')}
            className="dice-btn-3d dice-btn-green py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <span className="font-serif font-black text-xs drop-shadow-md" style={{ color: '#ffffff' }}>D4</span>
          </button>
          <button
            onClick={() => executeRoll(1, 8, '1d8 Damage')}
            className="dice-btn-3d dice-btn-red py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <span className="font-serif font-black text-xs drop-shadow-md" style={{ color: '#ffffff' }}>D8</span>
          </button>
          <button
            onClick={() => executeRoll(1, 12, '1d12 Heavy')}
            className="dice-btn-3d dice-btn-blue py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <span className="font-serif font-black text-xs drop-shadow-md" style={{ color: '#ffffff' }}>D12</span>
          </button>
          <button
            onClick={() => executeRoll(1, 100, 'd100 Percentile')}
            className="dice-btn-3d dice-btn-gold py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <span className="font-serif font-black text-xs drop-shadow-md" style={{ color: '#ffffff' }}>D100</span>
          </button>
        </div>
      )}

      {/* Roll History Drawer */}
      {rollHistory.length > 0 && (
        <div className={`rounded-xl p-2.5 space-y-1.5 border ${
          isScifi ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-[#fcf7ec] border-[#d9c49e] text-amber-950'
        }`}>
          <div className={`flex justify-between items-center text-[11px] font-serif font-bold ${
            isScifi ? 'text-cyan-300' : 'text-amber-950'
          }`}>
            <span>Latest Roll:</span>
            <button onClick={clearHistory} className="text-rose-400 hover:underline cursor-pointer">
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {rollHistory.slice(0, 5).map((r) => (
              <span
                key={r.id}
                className={`border rounded-lg px-2 py-0.5 text-xs font-mono font-bold whitespace-nowrap ${
                  isScifi
                    ? 'bg-slate-900 border-cyan-500/40 text-cyan-200'
                    : 'bg-white border-amber-300 text-gray-800'
                }`}
              >
                d{r.dieType}: <strong className={isScifi ? 'text-white' : 'text-amber-800'}>{r.total}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
