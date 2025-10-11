import { create } from 'zustand';

export interface LootItem {
  id: string;
  timestamp: number;
  mobName: string;
  mobLevel: number;
  itemName: string;
  itemType: string;
  rarity: string;
  assignedTo?: string;
}

interface LootStore {
  lootLog: LootItem[];
  addLoot: (loot: LootItem) => void;
  assignLoot: (id: string, playerName: string) => void;
  clearLoot: () => void;
}

export const useLootStore = create<LootStore>((set) => ({
  lootLog: [],
  
  addLoot: (loot) =>
    set((state) => ({
      lootLog: [loot, ...state.lootLog],
    })),
  
  assignLoot: (id, playerName) =>
    set((state) => ({
      lootLog: state.lootLog.map((item) =>
        item.id === id ? { ...item, assignedTo: playerName } : item
      ),
    })),
  
  clearLoot: () => set({ lootLog: [] }),
}));
