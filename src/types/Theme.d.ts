import type { Question } from './Question';

export interface Theme {
  name: string;
  questions: Question[];
}