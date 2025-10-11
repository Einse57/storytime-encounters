import React, { useState } from 'react';
import { useEncounterStore, type Entity } from '../stores/encounterStore';
import { Tooltip } from './Tooltip';

export const EncounterTracker: React.FC = () => {
  const { entities, currentTurn, removeEntity, damageEntity, healEntity, nextTurn, clearEncounter } = useEncounterStore();
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [damageAmount, setDamageAmount] = useState<number>(0);

  const handleDamage = () => {
    if (selectedEntity && damageAmount > 0) {
      damageEntity(selectedEntity, damageAmount);
      setDamageAmount(0);
    }
  };

  const handleHeal = () => {
    if (selectedEntity && damageAmount > 0) {
      healEntity(selectedEntity, damageAmount);
      setDamageAmount(0);
    }
  };

  const getHPPercentage = (entity: Entity) => {
    return (entity.currentHP / entity.maxHP) * 100;
  };

  const getHPColor = (percentage: number) => {
    if (percentage > 66) return 'bg-green-500';
    if (percentage > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Encounter Tracker</h2>
        <div className="flex gap-2">
          <button
            onClick={nextTurn}
            disabled={entities.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Next Turn
          </button>
          <button
            onClick={clearEncounter}
            disabled={entities.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* HP Modification Controls */}
      {entities.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select entity...</option>
              {entities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name} ({entity.currentHP}/{entity.maxHP} HP)
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={damageAmount}
              onChange={(e) => setDamageAmount(Number(e.target.value))}
              placeholder="Amount"
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDamage}
              disabled={!selectedEntity || damageAmount <= 0}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Damage
            </button>
            <button
              onClick={handleHeal}
              disabled={!selectedEntity || damageAmount <= 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Heal
            </button>
          </div>
        </div>
      )}

      {/* Entity List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {entities.length === 0 ? (
          <p className="text-gray-500 text-center italic py-8">
            No entities in encounter. Add mobs from the Mob Library.
          </p>
        ) : (
          entities.map((entity, index) => {
            const hpPercentage = getHPPercentage(entity);
            const isCurrentTurn = index === currentTurn;
            const isDead = entity.currentHP === 0;

            return (
              <div
                key={entity.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  isCurrentTurn
                    ? entity.type === 'player'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-blue-500 bg-blue-50 shadow-lg'
                    : isDead
                    ? 'border-gray-300 bg-gray-100 opacity-60'
                    : entity.type === 'player'
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {entity.name}
                      {isCurrentTurn && (
                        <span className={`ml-2 text-sm text-white px-2 py-1 rounded ${
                          entity.type === 'player' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          Current Turn
                        </span>
                      )}
                      {isDead && (
                        <span className="ml-2 text-sm bg-red-600 text-white px-2 py-1 rounded">
                          Defeated
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {entity.type === 'mob' ? '👹 Monster' : '⚔️ Player'} • <Tooltip term="AC">AC</Tooltip>: {entity.ac}
                      {entity.level && ` • `}<Tooltip term="Level">Level</Tooltip>{entity.level && `: ${entity.level}`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeEntity(entity.id)}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* HP Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700"><Tooltip term="HP">HP</Tooltip></span>
                    <span className="text-sm font-mono font-semibold text-gray-800">
                      {entity.currentHP} / {entity.maxHP}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getHPColor(hpPercentage)} transition-all duration-300`}
                      style={{ width: `${hpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
