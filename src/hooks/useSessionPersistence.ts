import { useEffect } from 'react';
import { useDiceStore } from '../stores/diceStore';
import { useEncounterStore } from '../stores/encounterStore';
import { useLootStore } from '../stores/lootStore';

const SESSION_KEY = 'storytime-encounters-session';

export const useSessionPersistence = () => {
  const diceStore = useDiceStore();
  const encounterStore = useEncounterStore();
  const lootStore = useLootStore();

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        
        // Restore dice history
        if (session.rollHistory) {
          session.rollHistory.forEach((roll: any) => {
            diceStore.addRoll(roll);
          });
        }
        
        // Restore encounters
        if (session.entities) {
          session.entities.forEach((entity: any) => {
            encounterStore.addEntity(entity);
          });
        }
        
        // Restore loot
        if (session.lootLog) {
          session.lootLog.forEach((loot: any) => {
            lootStore.addLoot(loot);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  }, []); // Only run on mount

  // Save session to localStorage whenever state changes
  useEffect(() => {
    const session = {
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
  }, [diceStore.rollHistory, encounterStore.entities, lootStore.lootLog]);

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    diceStore.clearHistory();
    encounterStore.clearEncounter();
    lootStore.clearLoot();
  };

  const exportSession = () => {
    const session = {
      rollHistory: diceStore.rollHistory,
      entities: encounterStore.entities,
      lootLog: lootStore.lootLog,
      timestamp: Date.now(),
      version: '1.0',
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
        
        // Import data
        if (session.rollHistory) {
          session.rollHistory.forEach((roll: any) => {
            diceStore.addRoll(roll);
          });
        }
        
        if (session.entities) {
          session.entities.forEach((entity: any) => {
            encounterStore.addEntity(entity);
          });
        }
        
        if (session.lootLog) {
          session.lootLog.forEach((loot: any) => {
            lootStore.addLoot(loot);
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
