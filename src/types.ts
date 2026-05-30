export interface Player {
  id: string;
  name: string;
  score: number;
  balance: number;
  prizes: WheelSegment[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  points: number;
}

export interface Challenge {
  id: string;
  categoryId: string;
  content: string;
  answer?: string;
}

export type ScreenState = 'setup' | 'dashboard' | 'challenge' | 'wheel';

export interface WheelSegment {
  label: string;
  type: 'money' | 'punishment';
  value?: number;
}
