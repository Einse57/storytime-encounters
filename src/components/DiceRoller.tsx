import React, { useState } from 'react';
import { useDiceStore, type DiceRoll } from '../stores/diceStore';

export const DiceRoller: React.FC = () => {
  const { rollHistory, addRoll, clearHistory } = useDiceStore();

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

  const handleRollAll = () => {
    executeRoll(1, 20, 'd20 Action');
    executeRoll(1, 10, 'd10 Check');
    executeRoll(1, 6, 'd6 Standard');
  };

  return (
    <div className="space-y-2.5">
      {/* Section Header (Matching Mockup) */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-serif font-extrabold text-sm sm:text-base text-gray-900 tracking-tight">
          1-Tap Quick Dice
        </h3>
        <button
          onClick={() => setShowAllDice(!showAllDice)}
          className="text-[11px] font-bold text-amber-900 hover:text-amber-700 underline cursor-pointer"
        >
          {showAllDice ? 'Fewer Dice' : '+ More Dice'}
        </button>
      </div>

      {/* Row of 4 Chunky 3D Dice Buttons (Matching Mockup Exactly) */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* D6 Red Button */}
        <button
          onClick={() => executeRoll(1, 6, '1d6 Standard')}
          className="dice-btn-3d dice-btn-red text-white py-3 sm:py-4 px-2 flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <span className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs">
            D6
          </span>
          <span className="font-mono font-black text-xl sm:text-2xl mt-0.5 drop-shadow-sm">
            {lastD6 !== null ? lastD6 : '—'}
          </span>
        </button>

        {/* D10 Blue Button */}
        <button
          onClick={() => executeRoll(1, 10, '1d10 Check')}
          className="dice-btn-3d dice-btn-blue text-white py-3 sm:py-4 px-2 flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <span className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs">
            D10
          </span>
          <span className="font-mono font-black text-xl sm:text-2xl mt-0.5 drop-shadow-sm">
            {lastD10 !== null ? lastD10 : '—'}
          </span>
        </button>

        {/* D20 Gold Button */}
        <button
          onClick={() => executeRoll(1, 20, '1d20 Action')}
          className="dice-btn-3d dice-btn-gold text-white py-3 sm:py-4 px-2 flex flex-col items-center justify-center cursor-pointer select-none ring-2 ring-amber-300"
        >
          <span className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs text-amber-100">
            D20
          </span>
          <span className="font-mono font-black text-xl sm:text-2xl mt-0.5 drop-shadow-sm text-yellow-100">
            {lastD20 !== null ? lastD20 : '—'}
          </span>
        </button>

        {/* ROLL ALL Green Button */}
        <button
          onClick={handleRollAll}
          className="dice-btn-3d dice-btn-green text-white py-3 sm:py-4 px-2 flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <span className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs leading-tight">
            ROLL
          </span>
          <span className="font-serif font-black text-sm sm:text-base mt-0.5 drop-shadow-sm leading-tight">
            ALL
          </span>
        </button>
      </div>

      {/* Expanded Extra Dice if Toggled */}
      {showAllDice && (
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => executeRoll(1, 4, '1d4 Minor')}
            className="dice-btn-3d dice-btn-purple text-white py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="font-serif font-bold text-xs">D4</span>
          </button>
          <button
            onClick={() => executeRoll(1, 8, '1d8 Damage')}
            className="dice-btn-3d dice-btn-red text-white py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="font-serif font-bold text-xs">D8</span>
          </button>
          <button
            onClick={() => executeRoll(1, 12, '1d12 Heavy')}
            className="dice-btn-3d dice-btn-blue text-white py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="font-serif font-bold text-xs">D12</span>
          </button>
          <button
            onClick={() => executeRoll(1, 100, 'd100 Percentile')}
            className="dice-btn-3d dice-btn-gold text-white py-2.5 px-2 flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="font-serif font-bold text-xs">D100</span>
          </button>
        </div>
      )}

      {/* Roll History Drawer */}
      {rollHistory.length > 0 && (
        <div className="bg-[#fcf7ec] border border-[#d9c49e] rounded-xl p-2.5 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-serif font-bold text-amber-950">
            <span>Latest Roll:</span>
            <button onClick={clearHistory} className="text-rose-700 hover:underline">
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {rollHistory.slice(0, 5).map((r) => (
              <span
                key={r.id}
                className="bg-white border border-amber-300 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-gray-800 whitespace-nowrap"
              >
                d{r.dieType}: <strong className="text-amber-800">{r.total}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
