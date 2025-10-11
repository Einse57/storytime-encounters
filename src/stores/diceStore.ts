import { create } from 'zustand';

export interface DiceRoll {
  id: string;
  timestamp: number;
  dieType: number;
  quantity: number;
  modifier: number;
  results: number[];
  total: number;
  description?: string;
}

interface DiceStore {
  rollHistory: DiceRoll[];
  addRoll: (roll: DiceRoll) => void;
  clearHistory: () => void;
}

export const useDiceStore = create<DiceStore>((set) => ({
  rollHistory: [],
  addRoll: (roll) =>
    set((state) => ({
      rollHistory: [roll, ...state.rollHistory].slice(0, 5), // Keep last 5 rolls
    })),
  clearHistory: () => set({ rollHistory: [] }),
}));
