import { useEffect } from 'react';
import { useDiceStore, type DiceRoll } from '../stores/diceStore';
import { useEncounterStore, type Entity } from '../stores/encounterStore';
import { useLootStore, type LootItem } from '../stores/lootStore';
import { useStoryStore } from '../stores/storyStore';

const SESSION_KEY = 'storytime-encounters-session';

export const useSessionPersistence = () => {
  const diceStore = useDiceStore();
  const encounterStore = useEncounterStore();
  const lootStore = useLootStore();
  const storyStore = useStoryStore();

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        
        // Restore story seed & pack
        if (session.story) {
          if (session.story.currentPackId) {
            useStoryStore.getState().setCurrentPack(session.story.currentPackId);
          }
          if (session.story.seed) {
            useStoryStore.getState().setSeed(
              session.story.seed.setting || '',
              session.story.seed.conflict || '',
              session.story.seed.hook || ''
            );
          }
        }
        
        // Restore dice history
        if (session.rollHistory && Array.isArray(session.rollHistory)) {
          useDiceStore.getState().clearHistory();
          session.rollHistory.forEach((roll: DiceRoll) => {
            useDiceStore.getState().addRoll(roll);
          });
        }
        
        // Restore encounters
        if (session.entities && Array.isArray(session.entities)) {
          useEncounterStore.getState().clearEncounter();
          session.entities.forEach((entity: Entity) => {
            useEncounterStore.getState().addEntity(entity);
          });
        }
        
        // Restore loot
        if (session.lootLog && Array.isArray(session.lootLog)) {
          useLootStore.getState().clearLoot();
          session.lootLog.forEach((loot: LootItem) => {
            useLootStore.getState().addLoot(loot);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  }, []);

  // Save session to localStorage whenever state changes
  useEffect(() => {
    const session = {
      story: {
        currentPackId: storyStore.currentPackId,
        seed: storyStore.seed,
        activeLoot: storyStore.activeLoot,
        activeCreature: storyStore.activeCreature,
        activeTwist: storyStore.activeTwist,
        sparkHistory: storyStore.sparkHistory,
      },
      rollHistory: diceStore.rollHistory,
      entities: encounterStore.entities,
      lootLog: lootStore.lootLog,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, [
    storyStore.currentPackId,
    storyStore.seed,
    storyStore.activeLoot,
    storyStore.activeCreature,
    storyStore.activeTwist,
    storyStore.sparkHistory,
    diceStore.rollHistory,
    encounterStore.entities,
    lootStore.lootLog,
  ]);

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    diceStore.clearHistory();
    encounterStore.clearEncounter();
    lootStore.clearLoot();
    storyStore.clearSparks();
    storyStore.clearHistory();
    storyStore.randomizeSeed();
  };

  const exportSession = () => {
    const session = {
      version: '2.0',
      timestamp: Date.now(),
      story: {
        currentPackId: storyStore.currentPackId,
        seed: storyStore.seed,
        activeLoot: storyStore.activeLoot,
        activeCreature: storyStore.activeCreature,
        activeTwist: storyStore.activeTwist,
        sparkHistory: storyStore.sparkHistory,
      },
      rollHistory: diceStore.rollHistory,
      entities: encounterStore.entities,
      lootLog: lootStore.lootLog,
    };

    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `storytime-session-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSession = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const session = JSON.parse(e.target?.result as string);
        
        // Clear existing session
        clearSession();
        
        // Import story state
        if (session.story) {
          if (session.story.currentPackId) {
            useStoryStore.getState().setCurrentPack(session.story.currentPackId);
          }
          if (session.story.seed) {
            useStoryStore.getState().setSeed(
              session.story.seed.setting || '',
              session.story.seed.conflict || '',
              session.story.seed.hook || ''
            );
          }
        }

        // Import dice data
        if (session.rollHistory && Array.isArray(session.rollHistory)) {
          session.rollHistory.forEach((roll: DiceRoll) => {
            useDiceStore.getState().addRoll(roll);
          });
        }
        
        // Import encounters
        if (session.entities && Array.isArray(session.entities)) {
          session.entities.forEach((entity: Entity) => {
            useEncounterStore.getState().addEntity(entity);
          });
        }
        
        // Import loot
        if (session.lootLog && Array.isArray(session.lootLog)) {
          session.lootLog.forEach((loot: LootItem) => {
            useLootStore.getState().addLoot(loot);
          });
        }
        
        alert('Session imported successfully!');
      } catch (error) {
        console.error('Failed to import session:', error);
        alert('Failed to import session. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return {
    clearSession,
    exportSession,
    importSession,
  };
};
