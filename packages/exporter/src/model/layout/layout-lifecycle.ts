import { Layers } from "../graph";

export interface LayoutLifecycle {
  /**
   * Called when the layout is started.
   */
  ready?: () => void;
  /**
   * transition layout.
   */
  transform?: (element: Layers) => void;
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
