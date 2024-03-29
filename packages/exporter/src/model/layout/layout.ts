import { defaultLayoutOptions, LayoutOptions } from "./layout-options";
import { Graph } from "../graph";

export type Direction = "LR" | "RL" | "TB" | "BT";

export class LayoutBase {
  private options: LayoutOptions;

  constructor(options: LayoutOptions = defaultLayoutOptions) {
    this.options = options;
  }
}

export interface LayoutConverter<I, T> {
  instance: I;

  // todo: thinking in Promise<Graph>
  layout(data: T): Graph;

  initInstance(options: any): void;

  preLayout(intermedia?: T): Graph;

  doLayout(intermedia?: T): Graph;

  postLayout(graph: Graph): Graph;
}

