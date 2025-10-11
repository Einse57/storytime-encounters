import React, { useState } from 'react';
import mobsData from '../data/mobs.json';
import lootTableData from '../data/lootTable.json';
import { useEncounterStore } from '../stores/encounterStore';
import { useLootStore } from '../stores/lootStore';
import type { Mob } from '../types/mob';
import { Tooltip } from './Tooltip';

const mobs = mobsData as Mob[];
const lootTable = lootTableData as Record<string, Array<{
  name: string;
  type: string;
  rarity: string;
}>>;

export const MobSelector: React.FC = () => {
  const [selectedMobId, setSelectedMobId] = useState<string>('');
  const [level, setLevel] = useState(1);
  const { addEntity } = useEncounterStore();
  const { addLoot } = useLootStore();

  const calculateScaledHP = (baseHP: number, level: number): number => {
    return Math.floor(baseHP * (1 + 0.2 * (level - 1)));
  };

  const generateLoot = (mob: Mob, level: number) => {
    const table = lootTable[mob.lootTable] || lootTable.common;
    const randomItem = table[Math.floor(Math.random() * table.length)];
    
    addLoot({
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      mobName: mob.name,
      mobLevel: level,
      itemName: randomItem.name,
      itemType: randomItem.type,
      rarity: randomItem.rarity,
    });
  };

  const addMobToEncounter = () => {
    const mob = mobs.find((m) => m.id === selectedMobId);
    if (!mob) return;

    const scaledHP = calculateScaledHP(mob.baseHP, level);
    const mobCount = useEncounterStore.getState().entities.filter(e => e.name.startsWith(mob.name)).length;
    const mobName = mobCount > 0 ? `${mob.name} ${mobCount + 1}` : mob.name;

    addEntity({
      id: `${Date.now()}-${Math.random()}`,
      name: mobName,
      type: 'mob',
      currentHP: scaledHP,
      maxHP: scaledHP,
      ac: mob.ac,
      mobId: mob.id,
      level,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Mob Library</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Creature
          </label>
          <select
            value={selectedMobId}
            onChange={(e) => setSelectedMobId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a creature...</option>
            {mobs.map((mob) => (
              <option key={mob.id} value={mob.id}>
                {mob.name} (Challenge {mob.challenge})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Challenge Rating indicates difficulty - higher = tougher
          </p>
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
            onChange={(e) => setLevel(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {selectedMobId && (
          <MobPreview 
            mob={mobs.find((m) => m.id === selectedMobId)!} 
            level={level}
            onGenerateLoot={generateLoot}
          />
        )}
        
        <button
          onClick={addMobToEncounter}
          disabled={!selectedMobId}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
        >
          Add to Encounter
        </button>
      </div>
    </div>
  );
};

interface MobPreviewProps {
  mob: Mob;
  level: number;
  onGenerateLoot: (mob: Mob, level: number) => void;
}

const MobPreview: React.FC<MobPreviewProps> = ({ mob, level, onGenerateLoot }) => {
  const scaledHP = Math.floor(mob.baseHP * (1 + 0.2 * (level - 1)));

  return (
    <div className="bg-parchment-100 border border-parchment-300 rounded-lg p-4">
      <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">{mob.name}</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div>
          <span className="font-semibold"><Tooltip term="HP">HP</Tooltip>:</span> {scaledHP}
        </div>
        <div>
          <span className="font-semibold"><Tooltip term="AC">AC</Tooltip>:</span> {mob.ac}
        </div>
        <div>
          <span className="font-semibold"><Tooltip term="Challenge">Challenge</Tooltip>:</span> {mob.challenge}
        </div>
        <div>
          <span className="font-semibold"><Tooltip term="Level">Level</Tooltip>:</span> {level}
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="font-semibold text-sm text-gray-700 mb-1">Moveset:</h4>
        <ul className="space-y-1">
          {mob.moveset.map((move, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              <span className="font-medium">{move.name}</span> ({move.type}): {move.damage}
            </li>
          ))}
        </ul>
      </div>
      
      <button
        onClick={() => onGenerateLoot(mob, level)}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200"
      >
        Generate Loot
      </button>
    </div>
  );
};
