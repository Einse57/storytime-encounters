export type SparkRarity = 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';

export type CreatureDemeanor = 'friendly' | 'mischievous' | 'mysterious' | 'cautious' | 'hostile';

export type ComplicationType = 'environmental' | 'surprise_visitor' | 'magical_surge' | 'mystery' | 'betrayal';

export interface StorySparkLoot {
  id: string;
  name: string;
  type: string;
  rarity: SparkRarity;
  description: string;
  storyHook: string;
}

export interface StorySparkCreature {
  id: string;
  name: string;
  category: string;
  demeanor: CreatureDemeanor;
  quirk: string;
  narrativePrompt: string;
}

export interface StorySparkTwist {
  id: string;
  title: string;
  complicationType: ComplicationType;
  description: string;
  quickAction: string;
}

export interface StoryPack {
  id: string;
  title: string;
  icon: string;
  genre: string;
  description: string;
  seeds: {
    settings: string[];
    conflicts: string[];
    hooks: string[];
  };
  sparks: {
    loot: StorySparkLoot[];
    creatures: StorySparkCreature[];
    twists: StorySparkTwist[];
  };
}
