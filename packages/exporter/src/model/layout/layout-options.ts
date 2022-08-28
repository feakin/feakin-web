import { Direction } from "./layout";

export const defaultLayoutOptions: LayoutOptions = {
  rankdir: 'TB',
  node: {
    width: 100,
    height: 40,
  }
}

export interface LayoutOptions {
  rankdir?: Direction;
  container?: HTMLElement;
  node: {
    // each node width
    width: number;
    // each node height
    height: number;
  }
}
