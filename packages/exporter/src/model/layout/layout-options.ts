import { Direction } from "./layout";

export const defaultLayoutOptions: LayoutOptions = {
  direction: 'TB',
  node: {
    width: 100,
    height: 40,
  }
}

export interface LayoutOptions {
  direction?: Direction;
  node: {
    // each node width
    width: number;
    // each node height
    height: number;
  },
  ext?: {
    node?: any,
    edge?: any,
    graph?: any
  }
}
