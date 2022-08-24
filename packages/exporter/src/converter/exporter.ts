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

  /**
   * In different diagram types, the export and intermediate type are different. Like in drawio, the intermediate type
   * is a {MxCell}, but in drawio, the end type is a MxFileRoot, it will wrap MxCell to string into MxFileRoot.
   */
  intermediate(): any {
    return {}
  }

  toString(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

export interface Transpiler {
  transpileNode(node: Node): any | void;

  transpileEdge(edge: Edge): any | void;

  // in some diagrams, the label is shown on the node
  transpileLabel?(node: Node, ...args: any[]): any | void;

  transpileStyle?(prop: ElementProperty): any | void;
}
