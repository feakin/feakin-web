import { MxGraph } from "./mxgraph/mxgraph";
import { Graph } from "../model/graph";

export class Converter {
  protected graph: MxGraph;

  constructor(graph: MxGraph) {
    this.graph = graph;
  }
}

export interface FeakinConverter {
  convert(): Graph;
}
