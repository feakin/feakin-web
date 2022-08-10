import { Elements } from "./element";

export interface LayoutLifecycle {
  /**
   * Called when the layout is started.
   */
  ready?: () => void;
  /**
   * transition layout.
   */
  transform?: (element: Elements) => void;
  /**
   * Called when the layout is stopped.
   */
  stop?: () => void;
  /**
   * when Window resize
   */
  resize?: () => void;
  /**
   * destroy view and render
   */
  destroy?: () => void;
}

export interface Layout extends LayoutLifecycle {
  // todo: output to examples?
  run: () => Layout;
}

export const defaultLayoutOptions = {
  rankdir: 'TB',
  node: {
    width: 100,
    height: 40,
  }
}

export interface LayoutOptions {
  rankdir?: string;
  container?: HTMLElement;
  node?: {
    // each node width
    width: number;
    // each node height
    height: number;
  }
}

export class SimpleLayout implements Layout {
  private options: object;

  constructor(options: LayoutOptions) {
    this.options = options;
  }

  run(): Layout {
    return this;
  }
}
