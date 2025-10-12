import type { Move } from './mob';

export interface Class {
  id: string;
  name: string;
  hitDie: number;
  baseAC: number;
  description: string;
  primaryStat: string;
  armorType: string;
  moveset: Move[];
}
