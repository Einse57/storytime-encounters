import type { ComicStyle, ComicStylePreset } from '../types/comic';
import { STYLE_PRESETS } from './promptEngine';

export type StoryArtSetting = 'fantasy' | 'scifi';

const SCIFI_PACKS = new Set(['scifi-frontier']);
const FANTASY_PACKS = new Set(['high-fantasy']);

const SCIFI_WORDS =
  /\b(ship|salvage|starship|spaceship|space|droid|laser|planet|robot|orbit|station|sci-?fi|frontier|android|cockpit)\b/gi;
const FANTASY_WORDS =
  /\b(magic|dragon|castle|wizard|kingdom|spell|fairy|sword|enchant|knight|quest|tavern)\b/gi;

const FANTASY_STYLES: ComicStyle[] = ['picture_book', 'watercolor', 'pixel_art', 'comic_book'];
const SCIFI_STYLES: ComicStyle[] = ['frontier_ink', 'pixel_frontier', 'comic_book', 'picture_book'];

export function getStylePreset(style: ComicStyle): ComicStylePreset {
  return STYLE_PRESETS[style];
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

export function isStyleAllowed(style: ComicStyle, setting: StoryArtSetting): boolean {
  return stylesForSetting(setting).includes(style);
}
