import { Node, Edge, Graph, ElementProperty } from "../model/graph";
import { ShapeType } from "../model/node/shape";

export class Exporter<K> {
  data: K | undefined;
  graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  export(): string {
    const intermediate = this.intermediate();
    if (typeof intermediate === "string") {
      return intermediate;
    } else {
      return JSON.stringify(intermediate, null, 2);
    }
  }

  /**
   * In different diagram types, the export and intermediate type are different. Like in drawio, the intermediate type
   * is a {MxCell}, but in drawio, the end type is a MxFileRoot, it will wrap MxCell to string into MxFileRoot.
   */
  intermediate(): K {
    return {} as K;
  }

  toString(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

export class SourceCodeExporter extends Exporter<string> {
  nodeMap: Map<string, Node> = new Map<string, Node>();
  indentLevel = 1;
  indentSize = 2;

  constructor(graph: Graph) {
    super(graph);
  }

  override export(): string {
    return this.toString();
  }

  insertEdge(edge: Edge): string {
    return ""
  }

  insertNode(node: Node): string {
    return `${this.space()}"${node.label}"`;
  }

  space(): string {
    return ' '.repeat(this.indentLevel * this.indentSize);
  }
}

export interface Transpiler {
  transpileNode(node: Node): any | void;

  transpileEdge(edge: Edge): any | void;

  // in some diagrams, the label is shown on the node
  transpileLabel?(node: Node, ...args: any[]): any | void;

  transpileStyle?(prop: ElementProperty): any | void;
}
