import { ElementsDefinition } from "./element";

export interface LayoutLifecycle {
  /**
   * Called when the layout is started.
   */
  ready?: () => void;
  /**
   * transition layout.
   */
  transform?: (element: ElementsDefinition) => void;
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
  run: () => Layout;
}

export interface LayoutOptions {
  container: HTMLElement;
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
