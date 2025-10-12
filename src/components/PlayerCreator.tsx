import React, { useState } from 'react';
import classesData from '../data/classes.json';
import { useEncounterStore } from '../stores/encounterStore';
import type { Class } from '../types/class';
import { Tooltip } from './Tooltip';

const classes = classesData as Class[];

export const PlayerCreator: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [level, setLevel] = useState(1);
  const { addEntity } = useEncounterStore();

  const calculateHP = (hitDie: number, level: number): number => {
    // First level gets max HP, subsequent levels get average
    const firstLevelHP = hitDie;
    const additionalLevels = level - 1;
    const averagePerLevel = Math.floor(hitDie / 2) + 1;
    return firstLevelHP + (additionalLevels * averagePerLevel);
  };

  const addPlayerToEncounter = () => {
    const selectedClass = classes.find((c) => c.id === selectedClassId);
    if (!selectedClass || !playerName.trim()) return;

    const hp = calculateHP(selectedClass.hitDie, level);
    const ac = selectedClass.baseAC;

    addEntity({
      id: `${Date.now()}-${Math.random()}`,
      name: playerName.trim(),
      type: 'player',
      currentHP: hp,
      maxHP: hp,
      ac,
      level,
      moveset: selectedClass.moveset,
    });

    // Reset form
    setPlayerName('');
    setLevel(1);
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Create Player</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Player Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={level}
            onChange={(e) => setLevel(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {selectedClass && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-serif font-semibold text-gray-800 mb-2">
              {selectedClass.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{selectedClass.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold"><Tooltip term="HP">HP</Tooltip>:</span>{' '}
                {calculateHP(selectedClass.hitDie, level)}
              </div>
              <div>
                <span className="font-semibold"><Tooltip term="AC">AC</Tooltip>:</span> {selectedClass.baseAC}
              </div>
              <div>
                <span className="font-semibold"><Tooltip term="HitDie">Hit Die</Tooltip>:</span> d{selectedClass.hitDie}
              </div>
              <div>
                <span className="font-semibold">Primary:</span> {selectedClass.primaryStat}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Armor:</span> {selectedClass.armorType}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={addPlayerToEncounter}
          disabled={!selectedClassId || !playerName.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
        >
          Add Player to Encounter
        </button>
      </div>
    </div>
  );
};
