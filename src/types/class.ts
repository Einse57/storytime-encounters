import type { Move } from './mob';

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Class {
  id: string;
  name: string;
  hitDie: number;
  baseAC: number;
  description: string;
  primaryStat: string;
  armorType: string;
  moveset: Move[];
  defaultAbilities: AbilityScores;
}
