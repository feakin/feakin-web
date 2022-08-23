import { MxGraph } from "./mxgraph/mxgraph";
import { Graph } from "../model/graph";

export class Converter {
  protected graph: MxGraph;

  constructor(graph: MxGraph) {
    this.graph = graph;
  }

  from(graph: MxGraph) {
    return new Converter(graph);
  }

  source(importer: Importer): Graph {
    return importer.parse();
  }

  target(exporter: Exporter): string {
    return exporter.export();
  }
}


class Importer {
  parse(): Graph {
    return {} as Graph;
  }
}

export class Exporter {
  graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  export(): string {
    return ""
  }
}
