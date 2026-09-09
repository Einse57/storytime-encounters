import type { ComicStyle, StoryPanel } from '../types/comic';
import type { StorySeedState } from '../stores/storyStore';
import type { StorySparkLoot, StorySparkCreature, StorySparkTwist } from '../types/storyPack';
import { parseSessionIntoPanels } from './promptEngine';
import { getStylePreset } from './artStyles';

function chunkTranscript(text: string, maxPanels = 5): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length === 0) return [];
  if (sentences.length <= maxPanels) return sentences;

  const size = Math.ceil(sentences.length / maxPanels);
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length && chunks.length < maxPanels; i += size) {
    chunks.push(sentences.slice(i, i + size).join(' '));
  }
  return chunks;
}

function quoteFrom(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const slice = cleaned.slice(0, 90).replace(/["\u201c\u201d]/g, '');
  return `\u201c${slice}${cleaned.length > 90 ? '\u2026' : ''}\u201d`;
}

/**
 * Rebuild story preview scenes from the full Story Log.
 * Falls back to seed/spark panels when the log is empty.
 */
export function buildScenesFromSession(
  transcript: string,
  seed: StorySeedState,
  loot: StorySparkLoot | null,
  creature: StorySparkCreature | null,
  twist: StorySparkTwist | null,
  style: ComicStyle,
): { panels: StoryPanel[]; note: string } {
  const preset = getStylePreset(style);
  const chunks = chunkTranscript(transcript.trim());

  if (chunks.length === 0) {
    return {
      panels: parseSessionIntoPanels(transcript, seed, loot, creature, twist, style),
      note: 'Story Log is empty, so Rebuild only used seeds and sparks. Add what you said or typed, then Rebuild again.',
    };
  }

  const settingText = seed.setting || 'the adventure setting';
  const stamp = Date.now();
  const panels: StoryPanel[] = chunks.map((caption, index) => {
    const n = index + 1;
    const flavor = [
      index === 1 && creature ? `featuring ${creature.name}` : '',
      index === Math.floor(chunks.length / 2) && twist ? twist.title : '',
      index === chunks.length - 1 && loot ? `ending with ${loot.name}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    return {
      id: `panel-${n}-${stamp}`,
      panelNumber: n,
      title: `Scene ${n}`,
      caption,
      dialogue: quoteFrom(caption),
      characterName: 'Story',
      visualPrompt: `${preset.promptPrefix} scene ${n} of ${chunks.length} set in ${settingText}${flavor ? `, ${flavor}` : ''}. Depict this moment from the story: ${caption.slice(0, 420)} ${preset.promptSuffix}`,
    };
  });

  return {
    panels,
    note: `Rebuilt ${panels.length} scenes from the story log. Paintings cleared \u2014 tap AI Paint to match the new scenes.`,
  };
}
