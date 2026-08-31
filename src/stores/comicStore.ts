import { create } from 'zustand';
import type { ComicStyle, StoryPanel } from '../types/comic';
import { parseSessionIntoPanels, generateImageWithGemini, STYLE_PRESETS } from '../utils/promptEngine';
import { useStoryStore } from './storyStore';
import { useAudioStore } from './audioStore';

const COMIC_STORAGE = 'storytime-session-comic-panels';

interface ComicStore {
  selectedStyle: ComicStyle;
  panels: StoryPanel[];
  viewMode: 'comic_grid' | 'storybook_page';
  currentPageIndex: number;
  isGeneratingStory: boolean;
  isGeneratingImages: boolean;
  generationError: string | null;

  // Actions
  setStyle: (style: ComicStyle) => void;
  setViewMode: (mode: 'comic_grid' | 'storybook_page') => void;
  setCurrentPageIndex: (index: number) => void;
  generatePanels: () => void;
  updatePanel: (id: string, updates: Partial<StoryPanel>) => void;
  generateImageForPanel: (panelId: string) => Promise<void>;
  generateAllImages: () => Promise<void>;
  clearPanels: () => void;
}

export const useComicStore = create<ComicStore>((set, get) => ({
  selectedStyle: 'comic_book',
  panels: (() => {
    try {
      const saved = localStorage.getItem(COMIC_STORAGE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),
  viewMode: 'comic_grid',
  currentPageIndex: 0,
  isGeneratingStory: false,
  isGeneratingImages: false,
  generationError: null,

  setStyle: (selectedStyle: ComicStyle) => {
    const { panels } = get();
    const preset = STYLE_PRESETS[selectedStyle];

    // Update existing panel prompts with new style
    const updatedPanels = panels.map((p) => ({
      ...p,
      visualPrompt: p.visualPrompt.replace(
        /A (vibrant comic book panel|whimsical children's picture book illustration|dreamy watercolor fantasy painting|beautiful 16-bit retro fantasy RPG pixel art scene)[^,]*,/,
        preset.promptPrefix
      ),
    }));

    set({ selectedStyle, panels: updatedPanels });
  },

  setViewMode: (viewMode) => set({ viewMode }),

  setCurrentPageIndex: (currentPageIndex) => set({ currentPageIndex }),

  generatePanels: () => {
    set({ isGeneratingStory: true, generationError: null });

    try {
      const storyState = useStoryStore.getState();
      const audioState = useAudioStore.getState();
      const { selectedStyle } = get();

      const newPanels = parseSessionIntoPanels(
        audioState.transcript,
        storyState.seed,
        storyState.activeLoot,
        storyState.activeCreature,
        storyState.activeTwist,
        selectedStyle
      );

      localStorage.setItem(COMIC_STORAGE, JSON.stringify(newPanels));
      set({
        panels: newPanels,
        currentPageIndex: 0,
        isGeneratingStory: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate scenes';
      set({ generationError: msg, isGeneratingStory: false });
    }
  },

  updatePanel: (id, updates) => {
    const { panels } = get();
    const updated = panels.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(COMIC_STORAGE, JSON.stringify(updated));
    set({ panels: updated });
  },

  generateImageForPanel: async (panelId: string) => {
    const { panels } = get();
    const apiKey = useAudioStore.getState().geminiApiKey;
    if (!apiKey) {
      set({ generationError: 'Please enter a Gemini API Key in the Audio Studio or settings to generate AI images.' });
      return;
    }

    const targetPanel = panels.find((p) => p.id === panelId);
    if (!targetPanel) return;

    // Set panel to generating
    get().updatePanel(panelId, { isGenerating: true });
    set({ generationError: null });

    try {
      const imageUrl = await generateImageWithGemini(targetPanel.visualPrompt, apiKey);
      get().updatePanel(panelId, { imageUrl, isGenerating: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image generation failed';
      get().updatePanel(panelId, { isGenerating: false });
      set({ generationError: msg });
    }
  },

  generateAllImages: async () => {
    const { panels } = get();
    const apiKey = useAudioStore.getState().geminiApiKey;
    if (!apiKey) {
      set({ generationError: 'Please enter a Gemini API Key to generate AI images directly.' });
      return;
    }

    set({ isGeneratingImages: true, generationError: null });

    for (const panel of panels) {
      try {
        get().updatePanel(panel.id, { isGenerating: true });
        const imageUrl = await generateImageWithGemini(panel.visualPrompt, apiKey);
        get().updatePanel(panel.id, { imageUrl, isGenerating: false });
      } catch (err: unknown) {
        console.warn(`Panel ${panel.panelNumber} failed:`, err);
        get().updatePanel(panel.id, { isGenerating: false });
      }
    }

    set({ isGeneratingImages: false });
  },

  clearPanels: () => {
    localStorage.removeItem(COMIC_STORAGE);
    set({
      panels: [],
      currentPageIndex: 0,
      generationError: null,
    });
  },
}));
