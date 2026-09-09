import { create } from 'zustand';
import type { ComicStyle, StoryPanel } from '../types/comic';
import { generateImageWithGemini } from '../utils/promptEngine';
import { getStylePreset, inferArtSetting, isStyleAllowed } from '../utils/artStyles';
import { buildScenesFromSession } from '../utils/rebuildScenes';
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

  setStyle: (style: ComicStyle) => void;
  setViewMode: (mode: 'comic_grid' | 'storybook_page') => void;
  setCurrentPageIndex: (index: number) => void;
  generatePanels: () => void;
  updatePanel: (id: string, updates: Partial<StoryPanel>) => void;
  generateImageForPanel: (panelId: string) => Promise<void>;
  generateAllImages: () => Promise<void>;
  clearPanels: () => void;
}

function persistPanels(panels: StoryPanel[]) {
  localStorage.setItem(COMIC_STORAGE, JSON.stringify(panels));
}

function currentArtSetting() {
  const story = useStoryStore.getState();
  const audio = useAudioStore.getState();
  return inferArtSetting({
    packId: story.currentPackId,
    setting: [story.seed.setting, story.seed.conflict, story.seed.hook].filter(Boolean).join(' '),
    transcript: audio.transcript,
  });
}

function promptForStyle(panel: StoryPanel, style: ComicStyle): string {
  const preset = getStylePreset(style);
  const moment = (panel.caption || panel.title || 'the current story moment').slice(0, 420);
  return `${preset.promptPrefix} Depict only this story moment, clearly in this visual style and not a previous painting: ${moment} ${preset.promptSuffix}`;
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
    if (selectedStyle === get().selectedStyle) return;
    if (!isStyleAllowed(selectedStyle, currentArtSetting())) return;

    const { panels, currentPageIndex } = get();
    const preset = getStylePreset(selectedStyle);
    const updatedPanels = panels.map((p) => ({
      ...p,
      imageUrl: undefined,
      isGenerating: false,
      visualPrompt: promptForStyle(p, selectedStyle),
    }));

    persistPanels(updatedPanels);
    const current = updatedPanels[currentPageIndex];
    const styleName = preset.name.split('/')[0].trim();
    set({
      selectedStyle,
      panels: updatedPanels,
      generationError: current
        ? `Dropped the old painting. Rendering this scene as ${styleName}…`
        : null,
    });

    if (current) {
      void get().generateImageForPanel(current.id);
    }
  },

  setViewMode: (viewMode) => set({ viewMode }),

  setCurrentPageIndex: (currentPageIndex) => set({ currentPageIndex }),

  generatePanels: () => {
    set({ isGeneratingStory: true, generationError: null });

    try {
      const storyState = useStoryStore.getState();
      const audioState = useAudioStore.getState();
      const { selectedStyle } = get();

      const { panels: newPanels, note } = buildScenesFromSession(
        audioState.transcript,
        storyState.seed,
        storyState.activeLoot,
        storyState.activeCreature,
        storyState.activeTwist,
        selectedStyle
      );

      persistPanels(newPanels);
      set({
        panels: newPanels,
        currentPageIndex: 0,
        isGeneratingStory: false,
        generationError: note,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate scenes';
      set({ generationError: msg, isGeneratingStory: false });
    }
  },

  updatePanel: (id, updates) => {
    const { panels } = get();
    const updated = panels.map((p) => (p.id === id ? { ...p, ...updates } : p));
    persistPanels(updated);
    set({ panels: updated });
  },

  generateImageForPanel: async (panelId: string) => {
    const { panels } = get();

    const targetPanel = panels.find((p) => p.id === panelId);
    if (!targetPanel) return;

    get().updatePanel(panelId, { isGenerating: true, imageUrl: undefined });
    set({ generationError: null });

    try {
      const imageUrl = await generateImageWithGemini(targetPanel.visualPrompt);
      const latest = get().panels.find((p) => p.id === panelId);
      if (!latest || latest.visualPrompt !== targetPanel.visualPrompt) return;
      get().updatePanel(panelId, { imageUrl, isGenerating: false });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Hosted AI illustration failed. Try Copy Prompt instead.';
      get().updatePanel(panelId, { isGenerating: false, imageUrl: undefined });
      set({ generationError: msg });
    }
  },

  generateAllImages: async () => {
    const { panels } = get();

    set({ isGeneratingImages: true, generationError: null });

    for (const panel of panels) {
      try {
        get().updatePanel(panel.id, { isGenerating: true, imageUrl: undefined });
        const imageUrl = await generateImageWithGemini(panel.visualPrompt);
        get().updatePanel(panel.id, { imageUrl, isGenerating: false });
      } catch (err: unknown) {
        console.warn(`Panel ${panel.panelNumber} failed:`, err);
        get().updatePanel(panel.id, { isGenerating: false });
        set({
          generationError:
            err instanceof Error
              ? err.message
              : 'Hosted AI illustration failed. Try Copy Prompt instead.',
        });
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
