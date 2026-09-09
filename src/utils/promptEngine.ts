import type { ComicStyle, ComicStylePreset, StoryPanel } from '../types/comic';
import type { StorySeedState } from '../stores/storyStore';
import type { StorySparkLoot, StorySparkCreature, StorySparkTwist } from '../types/storyPack';

export const STYLE_PRESETS: Record<ComicStyle, ComicStylePreset> = {
  comic_book: {
    id: 'comic_book',
    name: 'Comic Book / Graphic Novel',
    icon: '🦸',
    description: 'Dynamic action panels, bold ink linework, vivid saturated colors, and expressive graphic novel lighting.',
    promptPrefix: 'A vibrant comic book panel, bold clean black inking, dynamic dramatic angle, expressive characters, vivid color palette, halftone texture accents, graphic novel illustration,',
    promptSuffix: 'comic book art style, masterwork illustration, clean lines, no real photo, high quality graphic novel.',
    accentColor: 'from-amber-500 to-rose-600',
  },
  picture_book: {
    id: 'picture_book',
    name: 'Kids Picture Book',
    icon: '📚',
    description: 'Whimsical children’s storybook art, warm cozy lighting, adorable character designs, and rich storybook charm.',
    promptPrefix: 'A whimsical children\'s picture book illustration, soft warm golden lighting, charming friendly expressive character design, gentle storybook textures,',
    promptSuffix: 'storybook art style, beloved children\'s classic illustration, warm and inviting, high resolution.',
    accentColor: 'from-blue-500 to-indigo-600',
  },
  watercolor: {
    id: 'watercolor',
    name: 'Watercolor Fantasy',
    icon: '🎨',
    description: 'Delicate hand-painted watercolor washes, dreamy fairy-tale aura, and luminous soft lighting.',
    promptPrefix: 'A dreamy watercolor fantasy painting, fluid luminous washes, delicate wet-on-dry brushstrokes, soft magical glow, hand-painted texture on heavy rag paper,',
    promptSuffix: 'watercolor fantasy art, enchanting fairy tale illustration, atmospheric depth.',
    accentColor: 'from-emerald-500 to-teal-600',
  },
  pixel_art: {
    id: 'pixel_art',
    name: '16-Bit Pixel Art RPG',
    icon: '👾',
    description: 'Nostalgic retro 90s fantasy adventure game aesthetic with crisp colorful pixel details.',
    promptPrefix: 'A beautiful 16-bit retro fantasy RPG pixel art scene, clean pixel aesthetics, vibrant color palette, nostalgic 90s adventure game vibe,',
    promptSuffix: 'master pixel artist, pixel art illustration, crisp pixel definition, retro gaming art.',
    accentColor: 'from-purple-500 to-fuchsia-600',
  },
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

/**
 * Parses current session transcript, seeds, and sparks into a structured 3 to 5 panel story arc.
 */
export const parseSessionIntoPanels = (
  transcript: string,
  seed: StorySeedState,
  loot: StorySparkLoot | null,
  creature: StorySparkCreature | null,
  twist: StorySparkTwist | null,
  style: ComicStyle
): StoryPanel[] => {
  const preset = STYLE_PRESETS[style];
  const panels: StoryPanel[] = [];

  const rawTranscript = transcript.trim();
  const sentences = rawTranscript
    ? rawTranscript.split(/(?<=[.!?])\s+/).filter((s) => s.length > 5)
    : [];

  const settingText = seed.setting || 'an ancient enchanted land';
  const conflictText = seed.conflict || 'an unexpected mystery calls the party to action';
  const hookText = seed.hook || 'with an untold destiny hanging in the balance';

  const panel1Caption = sentences[0] || `Our adventure begins in ${settingText}. ${conflictText}.`;
  panels.push({
    id: `panel-1-${Date.now()}`,
    panelNumber: 1,
    title: 'Scene 1: The Journey Begins',
    caption: panel1Caption,
    dialogue: '“Look ahead! The adventure starts here!”',
    characterName: 'Adventurer',
    visualPrompt: `${preset.promptPrefix} establishing wide shot of ${settingText}, adventurous atmosphere, ${hookText}, ${preset.promptSuffix}`,
  });

  if (creature) {
    const panel2Caption =
      sentences[1] ||
      `Along the trail, the heroes meet ${creature.name}, a ${creature.category} known to be ${creature.demeanor}. ${creature.quirk}`;
    panels.push({
      id: `panel-2-${Date.now()}`,
      panelNumber: 2,
      title: `Scene 2: Encounter with ${creature.name}`,
      caption: panel2Caption,
      dialogue: creature.narrativePrompt ? `“${creature.narrativePrompt}”` : '“Halt! Who approaches my domain?”',
      characterName: creature.name,
      visualPrompt: `${preset.promptPrefix} medium shot of ${creature.name}, ${creature.category}, looking ${creature.demeanor}, in ${settingText}, ${creature.quirk}, ${preset.promptSuffix}`,
    });
  } else if (sentences[1]) {
    panels.push({
      id: `panel-2-${Date.now()}`,
      panelNumber: 2,
      title: 'Scene 2: Along the Way',
      caption: sentences[1],
      dialogue: '“Stay alert, something is shifting in the shadows...”',
      characterName: 'Hero',
      visualPrompt: `${preset.promptPrefix} characters exploring ${settingText}, finding strange clues, ${preset.promptSuffix}`,
    });
  }

  if (twist) {
    const panel3Caption =
      sentences[2] || `Suddenly, danger strikes! ${twist.title}: ${twist.description}`;
    panels.push({
      id: `panel-3-${Date.now()}`,
      panelNumber: panels.length + 1,
      title: `Scene 3: ${twist.title}`,
      caption: panel3Caption,
      dialogue: `“Quick! ${twist.quickAction}”`,
      characterName: 'Guide',
      visualPrompt: `${preset.promptPrefix} high action dramatic scene of ${twist.title}, ${twist.description}, dynamic energy, characters reacting bravely in ${settingText}, ${preset.promptSuffix}`,
    });
  } else if (sentences[2]) {
    panels.push({
      id: `panel-3-${Date.now()}`,
      panelNumber: panels.length + 1,
      title: 'Scene 3: The Climax',
      caption: sentences[2],
      dialogue: '“Together, we can overcome this!”',
      characterName: 'Party Leader',
      visualPrompt: `${preset.promptPrefix} heroic action moment in ${settingText}, magical illumination, ${preset.promptSuffix}`,
    });
  }

  if (loot) {
    const panel4Caption =
      sentences[3] ||
      `After overcoming the trial, the heroes uncover the legendary ${loot.name}! ${loot.description}`;
    panels.push({
      id: `panel-4-${Date.now()}`,
      panelNumber: panels.length + 1,
      title: `Scene 4: The Discovery of ${loot.name}`,
      caption: panel4Caption,
      dialogue: `“Incredible... the ${loot.name}! It’s truly wondrous!”`,
      characterName: 'Hero',
      visualPrompt: `${preset.promptPrefix} close-up heroic shot of characters admiring the glowing ${loot.name} (${loot.rarity} ${loot.type}), ${loot.description}, magical sparkling particles, triumphant atmosphere, ${preset.promptSuffix}`,
    });
  } else {
    const panel4Caption =
      sentences[3] || 'Triumphant and wiser, the adventurers celebrate their bravery as the sun rises over the horizon.';
    panels.push({
      id: `panel-4-${Date.now()}`,
      panelNumber: panels.length + 1,
      title: 'Scene 4: Victory & Sunset',
      caption: panel4Caption,
      dialogue: '“We did it! On to the next chapter!”',
      characterName: 'Everyone',
      visualPrompt: `${preset.promptPrefix} heartwarming triumphant finale scene of adventurers celebrating together in ${settingText}, golden hour sunset light, ${preset.promptSuffix}`,
    });
  }

  return panels;
};

/**
 * Builds a master prompt for Gemini Web Chat or ChatGPT
 */
export const buildMasterGeminiPrompt = (
  style: ComicStyle,
  panels: StoryPanel[]
): string => {
  const preset = STYLE_PRESETS[style];

  let prompt = `Please generate an illustrated ${preset.name.toLowerCase()} scene set for my tabletop story adventure!\n\n`;
  prompt += `**Visual Style Guidelines:**\n`;
  prompt += `- Style: ${preset.name}\n`;
  prompt += `- Aesthetic: ${preset.description}\n`;
  prompt += `- Maintain consistent character designs, colors, and lighting throughout all panels.\n\n`;
  prompt += `**Story Panels to Illustrate:**\n\n`;

  panels.forEach((panel) => {
    prompt += `### Panel ${panel.panelNumber}: ${panel.title}\n`;
    prompt += `**Narrative Caption:** ${panel.caption}\n`;
    if (panel.dialogue) {
      prompt += `**Dialogue Speech Bubble:** (${panel.characterName || 'Hero'}): "${panel.dialogue}"\n`;
    }
    prompt += `**Image Generation Prompt:** ${panel.visualPrompt}\n\n`;
  });

  prompt += `Please render these scenes as high quality ${preset.name.toLowerCase()} illustrations!`;
  return prompt;
};

/**
 * Generate an image via the hosted /api/illustrate serverless proxy
 */
export const generateImageWithGemini = async (prompt: string): Promise<string> => {
  const response = await fetch('/api/illustrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || `Illustration failed: ${response.status}`);
  }

  if (!data?.imageUrl) {
    throw new Error(data?.error || 'Illustration completed, but no image URL was returned.');
  }

  return data.imageUrl;
};
