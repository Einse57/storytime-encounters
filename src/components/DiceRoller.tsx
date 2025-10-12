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

  const rollDice = () => {
    const results: number[] = [];
    for (let i = 0; i < quantity; i++) {
      results.push(Math.floor(Math.random() * dieType) + 1);
    }
    
    const total = results.reduce((sum, val) => sum + val, 0) + selectedModifier;
    
    const roll: DiceRoll = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      dieType,
      quantity,
      modifier: selectedModifier,
      results,
      total,
      description: description || undefined,
    };
    
    addRoll(roll);
    setDescription('');
    setSelectedModifier(0);
  };

  const formatRollNotation = (roll: DiceRoll) => {
    const notation = `${roll.quantity}d${roll.dieType}${
      roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier < 0 ? roll.modifier : ''
    }`;
    return notation;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Dice Roller</h2>
      
      {/* Roll Controls */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Die Type
            </label>
            <select
              value={dieType}
              onChange={(e) => setDieType(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {DIE_TYPES.map((die) => (
                <option key={die} value={die}>
                  d{die}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Modifier Dropdown - Only visible in session with players */}
        {isSessionActive && players.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ability Modifier (Optional)
            </label>
            <select
              value={selectedModifier}
              onChange={(e) => setSelectedModifier(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Attack roll, Saving throw..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={rollDice}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
        >
          Roll {quantity}d{dieType}
          {selectedModifier !== 0 && (selectedModifier > 0 ? `+${selectedModifier}` : selectedModifier)}
        </button>
        
        {/* d20 Guide */}
        {dieType === 20 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-gray-700">
            <p className="font-semibold text-blue-800 mb-1">d20 Guide:</p>
            {isSessionActive ? (
              <p>
                <span className="font-medium">DC 10:</span> Easy • 
                <span className="font-medium"> DC 15:</span> Moderate • 
                <span className="font-medium"> DC 20:</span> Hard • 
                <span className="font-medium"> DC 25:</span> Very Hard • 
                <span className="font-medium"> DC 30:</span> Nearly Impossible
              </p>
            ) : (
              <p>
                <span className="font-medium">1-4:</span> Critical Fail • 
                <span className="font-medium"> 5-9:</span> Fail • 
                <span className="font-medium"> 10-14:</span> Partial Success • 
                <span className="font-medium"> 15-19:</span> Success • 
                <span className="font-medium"> 20:</span> Critical Success
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Roll History */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-serif font-semibold text-gray-700">Roll History</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Last 5 rolls
            </span>
            {rollHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                title="Clear roll history"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {rollHistory.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No rolls yet</p>
          ) : (
            rollHistory.map((roll) => (
              <div
                key={roll.id}
                className="bg-parchment-100 border border-parchment-300 rounded-md p-3"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-lg font-bold text-gray-800">
                    {formatRollNotation(roll)} = {roll.total}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(roll.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {roll.description && (
                  <p className="text-sm text-gray-600 mb-1">{roll.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  Rolls: [{roll.results.join(', ')}]
                  {roll.modifier !== 0 && ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
