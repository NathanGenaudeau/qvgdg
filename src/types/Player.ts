import type { Theme } from './Theme';

export class Player {
  name: string;
  theme1: Theme[];
  theme2: Theme[];
  score: number;
  score2: number;
  isVisible: boolean;
  isEditing: boolean;

  constructor(name: string) {
    this.name = name;
    this.theme1 = [];
    this.theme2 = [];
    this.score = 0;
    this.score2 = 0;
    this.isVisible = true;
    this.isEditing = false;
  }
}