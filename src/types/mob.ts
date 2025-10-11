export interface Move {
  name: string;
  damage: string;
  type: 'melee' | 'ranged' | 'special';
}

export interface Mob {
  id: string;
  name: string;
  baseHP: number;
  ac: number;
  challenge: number;
  moveset: Move[];
  lootTable: string;
}
