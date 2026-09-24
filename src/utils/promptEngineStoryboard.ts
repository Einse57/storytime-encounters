import type { ComicStyle, StoryPanel } from '../types/comic';
import type { StorySeedState } from '../stores/storyStore';
import { STYLE_PRESETS } from './promptEngineCore';

/**
 * One multi-panel storyboard prompt: every built scene as a distinct panel in a single image.
 * Used after Build/Rebuild so we only burn a single Gemini image gen (not N per-scene gens,
 * and not one abstract hero splash of the whole transcript).
 */
export const buildAllScenesStoryboardPrompt = (
  style: ComicStyle,
  panels: StoryPanel[],
  seed?: Pick<StorySeedState, 'setting' | 'conflict' | 'hook'>,
): string => {
  const preset = STYLE_PRESETS[style];
  const settingText = seed?.setting?.trim() || 'the adventure setting';
  const n = Math.max(panels.length, 1);

  const layoutHint =
    n <= 2
      ? 'two side-by-side panels'
      : n === 3
        ? 'a 1×3 comic-strip row'
        : n === 4
          ? 'a 2×2 storyboard grid'
          : `a clear ${n}-panel storyboard grid (rows of panels)`;

  const panelBlocks = panels
    .map((p) => {
      const caption = (p.caption || p.title || 'a story moment')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 280);
      const dialogue = p.dialogue
        ? ` Speech: (${p.characterName || 'character'}) ${p.dialogue}`
        : '';
      return `Panel ${p.panelNumber} — ${p.title}: ${caption}.${dialogue}`;
    })
    .join(' ');

  return (
    `${preset.promptPrefix} A single wide image that is a multi-panel comic storyboard ` +
    `(${layoutHint}) set in ${settingText}. Draw exactly ${n} DISTINCT bordered panels in ONE composition — ` +
    `one panel per scene, in reading order left-to-right then top-to-bottom. ` +
    `Do NOT collapse scenes into one abstract hero splash or montage without panel borders. ` +
    `Each panel must depict its own scene moment with clear gutters between panels. ` +
    `Keep character designs, colors, and lighting consistent across all panels. ` +
    `Scenes to illustrate: ${panelBlocks || 'Panel 1 — an unfolding tabletop story adventure.'} ` +
    `${preset.promptSuffix}`
  );
};

/**
 * Generate an image via the hosted /api/illustrate serverless proxy.
 * Surfaces app soft RATE_LIMIT (20/day, 2/min) separately from Google quota/exhausted errors.
 */
export const generateImageWithGemini = async (prompt: string): Promise<string> => {
  const response = await fetch('/api/illustrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    imageUrl?: string;
    error?: string;
    code?: string;
    quotaTier?: string | null;
    googleStatus?: number;
    model?: string;
  };

  if (!response.ok) {
    if (data?.code === 'RATE_LIMIT') {
      // Our soft ILLUSTRATE ceiling — already a clear human message from the API.
      throw new Error(data.error || 'App daily AI paint limit reached — try again tomorrow, or use Copy Prompt.');
    }
    if (data?.code === 'GOOGLE_QUOTA' || data?.code === 'GOOGLE_API_ERROR') {
      const tier = data.quotaTier ? ` [${data.quotaTier}]` : '';
      const statusBit =
        typeof data.googleStatus === 'number' ? ` (HTTP ${data.googleStatus})` : ` (HTTP ${response.status})`;
      throw new Error(`${data.error || 'Google image API error'}${tier}${statusBit}`);
    }
    throw new Error(data?.error || `Illustration failed: ${response.status}`);
  }

  if (!data?.imageUrl) {
    throw new Error(data?.error || 'Illustration completed, but no image URL was returned.');
  }

  return data.imageUrl;
};
