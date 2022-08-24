import { Node, Edge, Graph } from "../../model/graph";
import { SourceCodeExporter } from "../exporter";

export class DotExporter extends SourceCodeExporter {
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

  override insertEdge(edge: Edge): string {
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

  override insertNode(node: Node): string {
    return `${this.space()}"${node.label}"`;
  }
}
