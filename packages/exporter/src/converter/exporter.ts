import { Node, Edge, Graph, ElementProperty } from "../model/graph";

export class Exporter<K> {
  data: K | undefined;
  graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  export(): K {
    return {} as K;
  }

  toString(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

export interface Transpiler {
  transpileStyle(pro: ElementProperty): any | void;

  transpileNode(node: Node): any | void;

  transpileLabel(node: Node, ...args: any[]): any | void;

  transpileEdge(edge: Edge): any | void;
}
