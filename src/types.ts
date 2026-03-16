export type AreaId = 'photo' | 'stage' | 'food' | 'exchange';

export interface Area {
  id: AreaId;
  name: string;
  unlockCost: number;
  unlocked: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'once' | 'unlimited';
  completedCount: number;
  maxCount?: number;
  isVip?: boolean;
}

export interface BackpackItem {
  id: string;
  name: string;
  type: 'fragment' | 'sticker' | 'gift' | 'ticket' | 'decoration';
  count: number;
  category: string;
  icon?: string;
}

export interface PhotoGrid {
  id: number;
  unlocked: boolean;
  imageUrl?: string;
}

export interface AppState {
  tokens: number;
  unlockedAreas: AreaId[];
  backpack: BackpackItem[];
  tasks: Task[];
  photoGrids: PhotoGrid[];
  isVip: boolean;
}
