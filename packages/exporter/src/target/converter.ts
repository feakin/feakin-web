import { Graph, MxGraph } from "@feakin/exporter";

export class Converter {
  protected graph: MxGraph;

  constructor(graph: MxGraph) {
    this.graph = graph;
  }
}

export interface FeakinConverter {
  convert(): Graph;
}
