export type ComicStyle = 'comic_book' | 'picture_book' | 'watercolor' | 'pixel_art';

export interface StoryPanel {
  id: string;
  panelNumber: number;
  title: string;
  caption: string;
  dialogue?: string;
  characterName?: string;
  visualPrompt: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

export interface ComicStylePreset {
  id: ComicStyle;
  name: string;
  icon: string;
  description: string;
  promptPrefix: string;
  promptSuffix: string;
  accentColor: string;
}

export interface StoryBook {
  id: string;
  title: string;
  style: ComicStyle;
  panels: StoryPanel[];
  createdAt: number;
}
