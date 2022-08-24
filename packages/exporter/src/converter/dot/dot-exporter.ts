import { Node, Edge, Graph } from "../../model/graph";
import { Exporter } from "../exporter";

export class DotExporter extends Exporter<string> {
  nodeMap: Map<string, Node> = new Map<string, Node>();
  indentLevel = 1;
  indentSize = 2;

  constructor(graph: Graph) {
    super(graph);
  }

  override export(): string {
    const nodes = this.graph.nodes.map(node => {
      this.nodeMap.set(node.id, node)
      return this.insertNode(node);
    });

    const graph = this.graph.edges.map(edge => this.insertEdge(edge))

    return `digraph {
${ nodes.join('\n') }
${ graph.join('\n') }
}`
  }

  private insertEdge(edge: Edge): string {
    const source = this.nodeMap.get(edge.data?.source || '');
    const target = this.nodeMap.get(edge.data?.target || '');

    if (source && target) {
      return `${this.space()}"${ source.label }" -> "${ target.label }";`
    }

    if (source) {
      return `${this.space()}"${ source.label }"`
    }

    if (target) {
      return `${this.space()}"${ target.label }"`
    }

    return ``
  }

  private insertNode(node: Node): string {
    return `${this.space()}"${node.label}"`;
  }

  space(): string {
    return ' '.repeat(this.indentLevel * this.indentSize);
  }
}
