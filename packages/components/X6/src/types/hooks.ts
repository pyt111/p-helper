import type { Graph } from '@antv/x6';
import type { X6Props } from './props';

export type RegisterX6 = (instance: X6Methods, uuid: number | string) => void;
export interface X6Methods {
  setProps: (props: Partial<X6Props>) => void;
  getGraphInstance: () => Graph;
}
export type UseX6ReturnTypes = [RegisterX6, X6Methods];
