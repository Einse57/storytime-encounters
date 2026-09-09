import type { ComicStyle, ComicStylePreset } from '../types/comic';
import { STYLE_PRESETS } from './promptEngine';

export type StoryArtSetting = 'fantasy' | 'scifi';

const SCIFI_PACKS = new Set(['scifi-frontier']);
const FANTASY_PACKS = new Set(['high-fantasy']);

const SCIFI_WORDS =
  /\b(ship|salvage|starship|spaceship|space|droid|laser|planet|robot|orbit|station|sci-?fi|frontier|android|cockpit)\b/gi;
const FANTASY_WORDS =
  /\b(magic|dragon|castle|wizard|kingdom|spell|fairy|sword|enchant|knight|quest|tavern)\b/gi;

/** Sci-fi styles live here so fantasy watercolor stays off a salvage-yard story. */
export const SETTING_STYLE_PRESETS: Partial<Record<ComicStyle, ComicStylePreset>> = {
  frontier_ink: {
    id: 'frontier_ink',
    name: 'Frontier Ink',
    icon: '🚀',
    description: 'Gritty sci-fi comic ink, worn metal, dust, and hard frontier lighting.',
    promptPrefix:
      'A gritty sci-fi frontier comic panel, worn metal and dust, bold ink, cinematic salvage-yard lighting, expressive characters,',
    promptSuffix: 'sci-fi comic art, no fantasy castles, no watercolor fairy tale, high quality illustration.',
    accentColor: 'from-cyan-500 to-slate-700',
  },
  pixel_frontier: {
    id: 'pixel_frontier',
    name: '16-Bit Starship',
    icon: '👾',
    description: 'Retro 16-bit starship and frontier pixel art, not a fantasy RPG.',
    promptPrefix:
      'A 16-bit sci-fi pixel art scene of starships, salvage, and dusty frontier tech, crisp pixels, neon cockpit accents,',
    promptSuffix: 'sci-fi pixel art, retro space game, no swords-and-sorcery, crisp pixel definition.',
    accentColor: 'from-cyan-400 to-indigo-600',
  },
};

const FANTASY_STYLES: ComicStyle[] = ['picture_book', 'watercolor', 'pixel_art', 'comic_book'];
const SCIFI_STYLES: ComicStyle[] = ['frontier_ink', 'pixel_frontier', 'comic_book', 'picture_book'];

export function getStylePreset(style: ComicStyle): ComicStylePreset {
  return SETTING_STYLE_PRESETS[style] || STYLE_PRESETS[style];
}

export function inferArtSetting(input: {
  packId?: string;
  setting?: string;
  transcript?: string;
}): StoryArtSetting {
  if (input.packId && SCIFI_PACKS.has(input.packId)) return 'scifi';
  if (input.packId && FANTASY_PACKS.has(input.packId)) return 'fantasy';

  const blob = `${input.setting || ''} ${input.transcript || ''}`;
  const scifiHits = blob.match(SCIFI_WORDS)?.length || 0;
  const fantasyHits = blob.match(FANTASY_WORDS)?.length || 0;
  if (scifiHits > fantasyHits) return 'scifi';
  if (fantasyHits > scifiHits) return 'fantasy';
  return 'fantasy';
}

export function stylesForSetting(setting: StoryArtSetting): ComicStyle[] {
  return setting === 'scifi' ? SCIFI_STYLES : FANTASY_STYLES;
}

export function defaultStyleFor(setting: StoryArtSetting): ComicStyle {
  return setting === 'scifi' ? 'frontier_ink' : 'watercolor';
}
