import { defaultLayoutOptions, LayoutOptions } from "./layout-options";
import { Graph } from "../graph";

export type Direction = "LR" | "RL" | "TB" | "BT";

export class LayoutBase {
  private options: LayoutOptions;

  constructor(options: LayoutOptions = defaultLayoutOptions) {
    this.options = options;
  }
}

export interface LayoutConverter<I> {
  initCustomOptions(options: any): void;

  preLayout(intermedia: I): Graph;

  doLayout(intermedia: I): Graph;

  postLayout(graph: Graph): Graph;
}

