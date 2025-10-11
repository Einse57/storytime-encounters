import React from 'react';
import { useLootStore } from '../stores/lootStore';
import { useEncounterStore } from '../stores/encounterStore';

export const LootLog: React.FC = () => {
  const { lootLog, clearLoot, assignLoot } = useLootStore();
  const { entities } = useEncounterStore();
  
  const players = entities.filter((e) => e.type === 'player');

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'text-gray-600 bg-gray-100';
      case 'uncommon':
        return 'text-green-700 bg-green-100';
      case 'rare':
        return 'text-blue-700 bg-blue-100';
      case 'very rare':
        return 'text-purple-700 bg-purple-100';
      case 'legendary':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weapon':
        return '⚔️';
      case 'armor':
        return '🛡️';
      case 'currency':
        return '💰';
      case 'consumable':
        return '🧪';
      case 'material':
        return '📦';
      case 'treasure':
        return '💎';
      case 'quest':
        return '📜';
      case 'magic item':
        return '✨';
      case 'equipment':
        return '🔧';
      case 'ammunition':
        return '🏹';
      case 'accessory':
        return '💍';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Loot Log</h2>
        <button
          onClick={clearLoot}
          disabled={lootLog.length === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Clear Log
        </button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {lootLog.length === 0 ? (
          <p className="text-gray-500 text-center italic py-8">
            No loot yet. Generate loot from defeated monsters.
          </p>
        ) : (
          lootLog.map((item) => (
            <div
              key={item.id}
              className="bg-parchment-100 border border-parchment-300 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getTypeIcon(item.itemType)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.itemName}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getRarityColor(
                          item.rarity
                        )}`}
                      >
                        {item.rarity}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-200 text-gray-700">
                        {item.itemType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        From: <span className="font-medium">{item.mobName}</span> (Level{' '}
                        {item.mobLevel})
                      </p>
                      {item.assignedTo ? (
                        <p className="flex items-center gap-2">
                          <span className="text-purple-700 font-medium">⚔️ {item.assignedTo}</span>
                          <button
                            onClick={() => assignLoot(item.id, '')}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                          >
                            Unassign
                          </button>
                        </p>
                      ) : players.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500">Assign to:</label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                assignLoot(item.id, e.target.value);
                              }
                            }}
                            defaultValue=""
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select player...</option>
                            {players.map((player) => (
                              <option key={player.id} value={player.name}>
                                {player.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          Add players to assign loot
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {lootLog.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-semibold">Total Items:</span> {lootLog.length}
            </p>
            <p>
              <span className="font-semibold">Unassigned:</span>{' '}
              {lootLog.filter((item) => !item.assignedTo).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
