import parse, { Attr as DotAttr, AttrStmt, EdgeStmt, Graph as DotGraph, NodeId, NodeStmt, Subgraph } from "dotparser";
import { nanoid } from "nanoid";

import { Importer } from "../importer";
import { Edge, Graph, Node } from "../../model/graph";
import { dagreReLayout } from "../../layout/dagre/dagre-layout";

type DotElement = (AttrStmt | EdgeStmt | NodeStmt | Subgraph | NodeId);

export class DotImporter extends Importer {
  nodes: Map<(string | number), Node> = new Map();
  edges: Map<(string | number), Edge> = new Map();

  constructor(content: string) {
    super(content);
  }


  private parseGraph() {
    const graphs: DotGraph[] = parse(this.content);
    graphs.forEach((graph) => {
      this.parseChildren(graph.children, graph);
    })
  }

  //  thanks to: https://github.com/magjac/graphviz-visual-editor/blob/master/src/dot.js
  transpile(): Graph {
    this.parseGraph();

    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values())
    };
  }

  override parse(): Graph {
    const graph = this.transpile();
    const newIdMap: Map<string, string> = new Map();
    graph.nodes.forEach((node) => {
      const newId = nanoid();
      newIdMap.set(node.id, newId);
      node.id = newId;
    });

    graph.edges.forEach((edge) => {
      edge.id = nanoid();
      if(edge.data?.source && edge.data?.source.length > 0) {
        edge.data.sourceId = newIdMap.get(edge.data.source) || 'unknown';
      }
      if(edge.data?.target && edge.data?.target.length > 0) {
        edge.data.targetId = newIdMap.get(edge.data.target) || 'unknown';
      }
    });

    return dagreReLayout(graph);
  }

  private parseChildren(children: DotElement[], parent: DotGraph | DotElement, attrs?: any) {
    children.forEach((child, index) => {
      switch (child.type) {
        case "edge_stmt":
          this.parseChildren(child.edge_list, child, this.parseAttrs(child.attr_list));
          break;
        case "node_stmt":
          this.createNode(child);
          break;
        case "subgraph":
          this.parseChildren(child.children, child);
          break;
        case "node_id":
          this.createNodeId(child, parent, children as NodeId[], index, attrs);
          break;
        default:
          console.log("unsupported type" + JSON.stringify(child))
      }
    })
  }

  private createNodeId(child: NodeId, parent: DotElement | DotGraph, children: NodeId[], index: number, attrs?: any) {
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
          },
          ...attrs
        });
      }
    }
  }

  private parseAttrs(attr_list: DotAttr[]): any {
    return attr_list.reduce((attrs, attr) => {
      attrs[attr.id] = attr.eq;
      return attrs;
    }, {} as any);
  }

  private createNode(child: NodeStmt) {
    const nodeId = child.node_id.id;
    const attrs = this.parseAttrs(child.attr_list);

    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId.toString(),
        label: child.node_id.id.toString(),
        ...attrs
      });
    }
  }
}
