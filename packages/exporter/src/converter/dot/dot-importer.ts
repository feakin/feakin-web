import parse, { Attr as DotAttr, AttrStmt, EdgeStmt, Graph as DotGraph, NodeId, NodeStmt, Subgraph } from "dotparser";
import { nanoid } from "nanoid";

import { Importer } from "../importer";
import { Edge, Graph, Node } from "../../model/graph";
import { layoutFromGraph } from "../../layout/dagre/dagre-layout";

type DotElement = (AttrStmt | EdgeStmt | NodeStmt | Subgraph | NodeId | DotGraph);

export class DotImporter extends Importer {
  nodes: Map<(string | number), Node> = new Map();
  edges: Map<(string | number), Edge> = new Map();

  constructor(content: string) {
    super(content);
  }

  private parseGraph() {
    const graphs: DotGraph[] = parse(this.content);
    graphs.forEach((graph) => {
      this.parseChildren(graph.children, graph, undefined);
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
    const idNewIdMap: Map<string, string> = new Map();
    const labelIdMap: Map<string, string> = new Map();
    graph.nodes.forEach((node) => {
      const newId = nanoid();
      idNewIdMap.set(node.id, newId);
      node.id = newId;
      labelIdMap.set(node.id, node.label);
    });

    graph.edges.forEach((edge) => {
      edge.id = nanoid();
      if(edge.data?.source && edge.data?.source.length > 0) {
        edge.data.sourceId = idNewIdMap.get(edge.data.source) || 'unknown';
        edge.data.source = labelIdMap.get(edge.data.sourceId) || 'unknown';
      }
      if(edge.data?.target && edge.data?.target.length > 0) {
        edge.data.targetId = idNewIdMap.get(edge.data.target) || 'unknown';
        edge.data.target = labelIdMap.get(edge.data.targetId) || 'unknown';
      }
    });

    return layoutFromGraph(graph);
  }

  private parseChildren(children: DotElement[], parent: DotGraph | DotElement, attrs?: any, graphId?: string | number | undefined) {
    children.forEach((child, index) => {
      switch (child.type) {
        case "edge_stmt":
          this.parseChildren(child.edge_list, child, this.parseAttrs(child.attr_list), graphId);
          break;
        case "node_stmt":
          this.createNode(child, graphId);
          break;
        case "subgraph":
          this.parseChildren(child.children, child, null, child.id);
          break;
        case "node_id":
          this.createNodeId(child, parent, children as NodeId[], index, attrs, graphId);
          break;
        case "attr_stmt":
          // todo: add support for attrs
          break;
        default:
          console.error("unsupported type" + JSON.stringify(child))
      }
    })
  }

  private createNodeId(child: NodeId, parent: DotElement | DotGraph, children: NodeId[], index: number, attrs?: any, graphId?: string | number | undefined) {
    const nodeId = child.id;

    if(graphId) {
      attrs.parentId = graphId;
    }

    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId.toString(),
        label: child.id.toString(),
        data: {
          ...attrs,
        }
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
            ...attrs,
            source: lastNode.id.toString(),
            target: currentNode.id.toString(),
          },
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

  private createNode(child: NodeStmt, graphId: string | number | undefined) {
    const nodeId = child.node_id.id;
    const attrs = this.parseAttrs(child.attr_list);

    if(graphId) {
      attrs.parentId = graphId;
    }

    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId.toString(),
        label: attrs.label ? attrs.label : nodeId.toString(),
        data: {
          ...attrs
        },
      });
    }
  }
}
