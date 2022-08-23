import parse, { AttrStmt, EdgeStmt, Graph as DotGraph, NodeId, NodeStmt, Subgraph } from "dotparser";

import { Importer } from "../importer";
import { Edge, Graph, Node } from "../../model/graph";

type DotElement = (AttrStmt | EdgeStmt | NodeStmt | Subgraph | NodeId);

export class DotImporter extends Importer {
  nodes: Map<(string | number), Node> = new Map();
  edges: Map<(string | number), Edge> = new Map();

  constructor(content: string) {
    super(content);
  }

  //  thanks to: https://github.com/magjac/graphviz-visual-editor/blob/master/src/dot.js
  override parse(): Graph {
    const graphs: DotGraph[] = parse(this.content);
    graphs.forEach((graph) => {
      this.parseChildren(graph.children, graph);
    })

    // todo: regenerate ids;
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values())
    };
  }

  private parseChildren(children: DotElement[], parent: DotGraph | DotElement) {
    children.forEach((child, index) => {
      switch (child.type) {
        case "attr_stmt":
          break;
        case "edge_stmt":
          this.parseChildren(child.edge_list, child);
          break;
        case "node_stmt":
          break;
        case "subgraph":
          break;
        case "node_id":
          this.createNode(child, parent, children as NodeId[], index);
          break;
        default:
          console.log("unsupported type" + JSON.stringify(child))
      }
    })
  }

  private createNode(child: NodeId, parent: DotElement | DotGraph, children: NodeId[], index: number) {
    const nodeId = child.id;

    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId.toString(),
        label: child.id.toString(),
      });
    }

    if (parent.type === "edge_stmt") {
      const isNeedSkipSourceNode = index > 0;
      if (isNeedSkipSourceNode) {
        const lastNode = children[index - 1];
        const currentNode = child;

        let edgeId = `${ lastNode.id }_${ currentNode.id }`;

        if (this.edges.has(edgeId)) {
          edgeId = `${ edgeId }_${ index }`;
        }

        this.edges.set(edgeId, {
          id: edgeId,
          points: [],
          data: {
            source: lastNode.id.toString(),
            target: currentNode.id.toString()
          }
        });
      }
    }
  }
}
