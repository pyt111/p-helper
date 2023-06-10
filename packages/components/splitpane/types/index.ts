import type { CSSProperties } from 'vue';

export interface PaneItemConfig {
  id: number;
  min: number | string;
  max: number | string;
  size: number | string | null;
  update: (style: CSSProperties) => void;
}

export type MoveDirection = 'left' | 'right' | 'top' | 'bottom';
export type DragDirection = 'forward' | 'backward' | '';
