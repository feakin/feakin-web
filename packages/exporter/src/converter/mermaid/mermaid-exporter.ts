import { SourceCodeExporter } from "../exporter";
import { Edge, Node } from "../../model/graph";

export class MermaidExporter extends SourceCodeExporter{
  override indentSize = 4;

  override export(): string {
    const nodes = this.graph.nodes.map(node => {
      this.nodeMap.set(node.id, node)
      return this.insertNode(node);
    });

    const graph = this.graph.edges.map(edge => this.insertEdge(edge))

    return `graph TD
${ nodes.join('\n') }
${ graph.join('\n') }

`
  }

  override insertEdge(edge: Edge): string {
    const source = this.nodeMap.get(edge.data?.source || '');
    const target = this.nodeMap.get(edge.data?.target || '');

    if (source && target) {
      return `${this.space()}${ source.label } --> ${ target.label }`
    }

    if (source) {
      return `${this.space()}${ source.label }`
    }

    if (target) {
      return `${this.space()}${ target.label }`
    }

    return ``
  }

  override insertNode(node: Node): string {
    return `${this.space()}${node.label}`;
  }
}
