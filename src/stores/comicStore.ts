import { create } from 'zustand';
import type { ComicStyle, StoryPanel } from '../types/comic';
import { buildAllScenesStoryboardPrompt, generateImageWithGemini } from '../utils/promptEngine';
import { getStylePreset, inferArtSetting, isStyleAllowed } from '../utils/artStyles';
import { buildScenesFromSession } from '../utils/rebuildScenes';
import { useStoryStore } from './storyStore';
import { useAudioStore } from './audioStore';

const COMIC_STORAGE = 'storytime-session-comic-panels';
const STORYBOARD_STORAGE = 'storytime-session-comic-storyboard';

interface ComicStore {
  selectedStyle: ComicStyle;
  panels: StoryPanel[];
  /** One multi-panel storyboard image of every scene (quota-friendly single gen). */
  storyboardImageUrl: string | null;
  currentPageIndex: number;
  isGeneratingStory: boolean;
  isGeneratingImages: boolean;
  generationError: string | null;

  setStyle: (style: ComicStyle) => void;
  setCurrentPageIndex: (index: number) => void;
  generatePanels: () => void;
  updatePanel: (id: string, updates: Partial<StoryPanel>) => void;
  generateAllScenesImage: () => Promise<void>;
  generateImageForPanel: (panelId: string) => Promise<void>;
  /** Optional multi-panel paint — not used by Build/Rebuild (quota). */
  generateAllImages: () => Promise<void>;
  clearPanels: () => void;
}

function persistPanels(panels: StoryPanel[]) {
  localStorage.setItem(COMIC_STORAGE, JSON.stringify(panels));
}

function persistStoryboard(storyboardImageUrl: string | null) {
  if (storyboardImageUrl) {
    localStorage.setItem(STORYBOARD_STORAGE, storyboardImageUrl);
  } else {
    localStorage.removeItem(STORYBOARD_STORAGE);
  }
}

function loadStoryboard(): string | null {
  try {
    return localStorage.getItem(STORYBOARD_STORAGE);
  } catch {
    return null;
  }
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
  storyboardImageUrl: loadStoryboard(),
  currentPageIndex: 0,
  isGeneratingStory: false,
  isGeneratingImages: false,
  generationError: null,

  setStyle: (selectedStyle: ComicStyle) => {
    if (selectedStyle === get().selectedStyle) return;
    if (!isStyleAllowed(selectedStyle, currentArtSetting())) return;

    const { panels } = get();
    const preset = getStylePreset(selectedStyle);
    const updatedPanels = panels.map((p) => ({
      ...p,
      imageUrl: undefined,
      isGenerating: false,
      visualPrompt: promptForStyle(p, selectedStyle),
    }));

    persistPanels(updatedPanels);
    persistStoryboard(null);
    const styleName = preset.name.split('/')[0].trim();
    set({
      selectedStyle,
      panels: updatedPanels,
      storyboardImageUrl: null,
      generationError: panels.length
        ? `Dropped the old painting. Painting all scenes as ${styleName}…`
        : null,
    });

    if (panels.length > 0) {
      void get().generateAllScenesImage();
    }
  },

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
      persistStoryboard(null);
      set({
        panels: newPanels,
        storyboardImageUrl: null,
        currentPageIndex: 0,
        isGeneratingStory: false,
        generationError: note,
      });

      // One storyboard of all scenes — not N gens, not a transcript-only hero splash.
      if (newPanels.length > 0) {
        void get().generateAllScenesImage();
      }
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

  generateAllScenesImage: async () => {
    const { selectedStyle, panels } = get();
    if (panels.length === 0) return;

    const storyState = useStoryStore.getState();
    const prompt = buildAllScenesStoryboardPrompt(
      selectedStyle,
      panels,
      storyState.seed,
    );

    set({
      isGeneratingImages: true,
      storyboardImageUrl: null,
      generationError: `Painting all ${panels.length} scenes into one storyboard… old art cleared.`,
    });
    persistStoryboard(null);

    try {
      const imageUrl = await generateImageWithGemini(prompt);
      // Abort if panels were rebuilt while we were painting.
      if (get().panels.length === 0 || get().panels[0]?.id !== panels[0]?.id) return;
      persistStoryboard(imageUrl);
      set({
        storyboardImageUrl: imageUrl,
        isGeneratingImages: false,
        generationError: `Painted all ${panels.length} scenes as one storyboard.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Hosted AI illustration failed. Try Copy Prompt instead.';
      set({
        isGeneratingImages: false,
        storyboardImageUrl: null,
        generationError: msg,
      });
    }
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
    if (panels.length === 0) return;

    set({
      isGeneratingImages: true,
      generationError: `Painting ${panels.length} scene${panels.length === 1 ? '' : 's'}… old art cleared.`,
    });

    let painted = 0;
    let lastError: string | null = null;

    for (const panel of panels) {
      // Stop if panels were rebuilt mid-paint (ids changed).
      if (!get().panels.some((p) => p.id === panel.id)) break;

      try {
        get().updatePanel(panel.id, { isGenerating: true, imageUrl: undefined });
        const imageUrl = await generateImageWithGemini(panel.visualPrompt);
        const stillThere = get().panels.find((p) => p.id === panel.id);
        if (!stillThere || stillThere.visualPrompt !== panel.visualPrompt) continue;
        get().updatePanel(panel.id, { imageUrl, isGenerating: false });
        painted += 1;
        set({
          generationError: `Painted ${painted} of ${panels.length}…`,
        });
      } catch (err: unknown) {
        console.warn(`Panel ${panel.panelNumber} failed:`, err);
        get().updatePanel(panel.id, { isGenerating: false });
        lastError =
          err instanceof Error
            ? err.message
            : 'Hosted AI illustration failed. Try Copy Prompt instead.';
        set({ generationError: lastError });
      }
    }

    set({
      isGeneratingImages: false,
      generationError: lastError
        ? lastError
        : painted > 0
          ? `Painted ${painted} scene${painted === 1 ? '' : 's'}.`
          : null,
    });
  },

  clearPanels: () => {
    localStorage.removeItem(COMIC_STORAGE);
    localStorage.removeItem(STORYBOARD_STORAGE);
    // Drop legacy hero key from the prior splash direction.
    localStorage.removeItem('storytime-session-comic-hero');
    set({
      panels: [],
      storyboardImageUrl: null,
      currentPageIndex: 0,
      generationError: null,
    });
  },
}));
