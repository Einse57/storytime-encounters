import { create } from 'zustand';

export interface Entity {
  id: string;
  name: string;
  type: 'mob' | 'player';
  currentHP: number;
  maxHP: number;
  ac: number;
  initiative?: number;
  mobId?: string;
  level?: number;
}

interface EncounterStore {
  entities: Entity[];
  currentTurn: number;
  addEntity: (entity: Entity) => void;
  removeEntity: (id: string) => void;
  updateHP: (id: string, newHP: number) => void;
  damageEntity: (id: string, damage: number) => void;
  healEntity: (id: string, healing: number) => void;
  nextTurn: () => void;
  clearEncounter: () => void;
  setInitiative: (id: string, initiative: number) => void;
}

export const useEncounterStore = create<EncounterStore>((set) => ({
  entities: [],
  currentTurn: 0,
  
  addEntity: (entity) =>
    set((state) => ({
      entities: [...state.entities, entity],
    })),
  
  removeEntity: (id) =>
    set((state) => ({
      entities: state.entities.filter((e) => e.id !== id),
    })),
  
  updateHP: (id, newHP) =>
    set((state) => ({
      entities: state.entities.map((e) =>
        e.id === id ? { ...e, currentHP: Math.max(0, Math.min(newHP, e.maxHP)) } : e
      ),
    })),
  
  damageEntity: (id, damage) =>
    set((state) => ({
      entities: state.entities.map((e) =>
        e.id === id ? { ...e, currentHP: Math.max(0, e.currentHP - damage) } : e
      ),
    })),
  
  healEntity: (id, healing) =>
    set((state) => ({
      entities: state.entities.map((e) =>
        e.id === id ? { ...e, currentHP: Math.min(e.maxHP, e.currentHP + healing) } : e
      ),
    })),
  
  nextTurn: () =>
    set((state) => ({
      currentTurn: (state.currentTurn + 1) % Math.max(1, state.entities.length),
    })),
  
  clearEncounter: () =>
    set({
      entities: [],
      currentTurn: 0,
    }),
  
  setInitiative: (id, initiative) =>
    set((state) => ({
      entities: state.entities.map((e) =>
        e.id === id ? { ...e, initiative } : e
      ),
    })),
}));
