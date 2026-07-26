export interface LottoGame {
  id: string;
  numbers: number[]; // 6 sorted numbers
  bonusNumber?: number;
  label: 'A' | 'B' | 'C' | 'D' | 'E' | string;
  createdAt: number;
  isFavorite?: boolean;
  type: 'auto' | 'custom' | 'dream' | 'simulated';
}

export interface LottoSet {
  id: string;
  title: string;
  createdAt: number;
  games: LottoGame[];
}

export interface FilterOptions {
  fixedNumbers: number[]; // Max 5 numbers
  excludedNumbers: number[];
  oddEvenRatio: 'ALL' | '3:3' | '4:2' | '2:4' | '5:1' | '1:5';
  sumRange: [number, number]; // e.g. [100, 180]
  consecutiveLimit: number; // e.g. max 2 consecutive numbers
}

export interface DreamKeyword {
  word: string;
  category: string;
  numbers: number[];
  description: string;
}

export interface WinningNumbers {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}
