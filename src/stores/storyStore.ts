import { create } from 'zustand';
import storyPacksData from '../data/storyPacks.json';
import type { StoryPack, StorySparkLoot, StorySparkCreature, StorySparkTwist } from '../types/storyPack';

const storyPacks = storyPacksData as StoryPack[];

export interface StorySeedState {
  setting: string;
  conflict: string;
  hook: string;
  isSettingLocked: boolean;
  isConflictLocked: boolean;
  isHookLocked: boolean;
}

export interface SparkHistoryItem {
  id: string;
  timestamp: number;
  type: 'loot' | 'creature' | 'twist';
  title: string;
  details: string;
  badge?: string;
}

interface StoryStore {
  packs: StoryPack[];
  currentPackId: string;
  seed: StorySeedState;
  activeLoot: StorySparkLoot | null;
  activeCreature: StorySparkCreature | null;
  activeTwist: StorySparkTwist | null;
  sparkHistory: SparkHistoryItem[];

  // Pack selector
  setCurrentPack: (packId: string) => void;
  getCurrentPack: () => StoryPack;

  // Seed actions
  randomizeSeed: () => void;
  rollSetting: () => void;
  rollConflict: () => void;
  rollHook: () => void;
  toggleLock: (key: 'setting' | 'conflict' | 'hook') => void;
  setSeed: (setting: string, conflict: string, hook: string) => void;

  // Spark actions
  rollLoot: () => void;
  rollCreature: () => void;
  rollTwist: () => void;
  rollAllSparks: () => void;
  clearSparks: () => void;
  clearHistory: () => void;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  packs: storyPacks,
  currentPackId: 'high-fantasy',
  seed: {
    setting: '',
    conflict: '',
    hook: '',
    isSettingLocked: false,
    isConflictLocked: false,
    isHookLocked: false,
  },
  activeLoot: null,
  activeCreature: null,
  activeTwist: null,
  sparkHistory: [],

  setCurrentPack: (packId: string) => {
    const pack = storyPacks.find((p) => p.id === packId);
    if (!pack) return;
    set({ currentPackId: packId });
    get().randomizeSeed();
  },

  getCurrentPack: () => {
    const { currentPackId, packs } = get();
    return packs.find((p) => p.id === currentPackId) || packs[0];
  },

  randomizeSeed: () => {
    const pack = get().getCurrentPack();
    const { settings, conflicts, hooks } = pack.seeds;

    const randomSetting = settings[Math.floor(Math.random() * settings.length)];
    const randomConflict = conflicts[Math.floor(Math.random() * conflicts.length)];
    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];

    set((state) => ({
      seed: {
        ...state.seed,
        setting: randomSetting,
        conflict: randomConflict,
        hook: randomHook,
      },
    }));
  },

  rollSetting: () => {
    const pack = get().getCurrentPack();
    const { settings } = pack.seeds;
    if (!settings.length) return;
    const randomSetting = settings[Math.floor(Math.random() * settings.length)];
    set((state) => ({
      seed: { ...state.seed, setting: randomSetting },
    }));
  },

  rollConflict: () => {
    const pack = get().getCurrentPack();
    const { conflicts } = pack.seeds;
    if (!conflicts.length) return;
    const randomConflict = conflicts[Math.floor(Math.random() * conflicts.length)];
    set((state) => ({
      seed: { ...state.seed, conflict: randomConflict },
    }));
  },

  rollHook: () => {
    const pack = get().getCurrentPack();
    const { hooks } = pack.seeds;
    if (!hooks.length) return;
    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
    set((state) => ({
      seed: { ...state.seed, hook: randomHook },
    }));
  },

  toggleLock: (key: 'setting' | 'conflict' | 'hook') => {
    const { seed } = get();
    if (key === 'setting') {
      set({ seed: { ...seed, isSettingLocked: !seed.isSettingLocked } });
    } else if (key === 'conflict') {
      set({ seed: { ...seed, isConflictLocked: !seed.isConflictLocked } });
    } else if (key === 'hook') {
      set({ seed: { ...seed, isHookLocked: !seed.isHookLocked } });
    }
  },

  setSeed: (setting, conflict, hook) => {
    set((state) => ({
      seed: {
        ...state.seed,
        setting,
        conflict,
        hook,
      },
    }));
  },

  rollLoot: () => {
    const pack = get().getCurrentPack();
    const loots = pack.sparks.loot;
    if (!loots.length) return;
    const selected = loots[Math.floor(Math.random() * loots.length)];

    const historyItem: SparkHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      type: 'loot',
      title: selected.name,
      details: `${selected.description} Hook: ${selected.storyHook}`,
      badge: `${selected.rarity.toUpperCase()} • ${selected.type}`,
    };

    set((state) => ({
      activeLoot: selected,
      sparkHistory: [historyItem, ...state.sparkHistory].slice(0, 20),
    }));
  },

  rollCreature: () => {
    const pack = get().getCurrentPack();
    const creatures = pack.sparks.creatures;
    if (!creatures.length) return;
    const selected = creatures[Math.floor(Math.random() * creatures.length)];

    const historyItem: SparkHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      type: 'creature',
      title: selected.name,
      details: `[${selected.demeanor.toUpperCase()}] ${selected.quirk} Hook: ${selected.narrativePrompt}`,
      badge: selected.category,
    };

    set((state) => ({
      activeCreature: selected,
      sparkHistory: [historyItem, ...state.sparkHistory].slice(0, 20),
    }));
  },

  rollTwist: () => {
    const pack = get().getCurrentPack();
    const twists = pack.sparks.twists;
    if (!twists.length) return;
    const selected = twists[Math.floor(Math.random() * twists.length)];

    const historyItem: SparkHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      type: 'twist',
      title: selected.title,
      details: `${selected.description} Action: ${selected.quickAction}`,
      badge: selected.complicationType.replace('_', ' ').toUpperCase(),
    };

    set((state) => ({
      activeTwist: selected,
      sparkHistory: [historyItem, ...state.sparkHistory].slice(0, 20),
    }));
  },

  rollAllSparks: () => {
    get().rollLoot();
    get().rollCreature();
    get().rollTwist();
  },

  clearSparks: () => {
    set({
      activeLoot: null,
      activeCreature: null,
      activeTwist: null,
    });
  },

  clearHistory: () => {
    set({ sparkHistory: [] });
  },
}));
