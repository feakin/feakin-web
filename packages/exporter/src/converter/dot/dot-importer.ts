import parse, {
  Attr as DotAttr,
  AttrStmt,
  EdgeStmt,
  Graph as DotGraph,
  HTMLString,
  NodeId,
  NodeStmt,
  Subgraph
} from "dotparser";
import { nanoid } from "nanoid";

import { Importer } from "../importer";
import { Edge, ElementProperty, Graph, Node } from "../../model/graph";
import { layoutFromGraph } from "../../layout/dagre/dagre-layout";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { LineType } from "../../model/edge/decorator/line-type";
import { LineDashStyle } from "../../model/edge/decorator/line-dash-style";

type DotElement = (AttrStmt | EdgeStmt | NodeStmt | Subgraph | NodeId | DotGraph);

export class DotImporter extends Importer {
  nodes: Map<(string | number), Node> = new Map();
  edges: Map<(string | number), Edge> = new Map();
  subgraphNode: Map<(string | number), {
    label: string;
    parentId?: string | number | undefined;
  }> = new Map();
  private currentSubgraphIds: (string | number | undefined)[] = [];

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
      if (edge.data?.source && edge.data?.source.length > 0) {
        edge.data.sourceId = idNewIdMap.get(edge.data.source) || 'unknown';
        edge.data.source = labelIdMap.get(edge.data.sourceId) || 'unknown';
      }
      if (edge.data?.target && edge.data?.target.length > 0) {
        edge.data.targetId = idNewIdMap.get(edge.data.target) || 'unknown';
        edge.data.target = labelIdMap.get(edge.data.targetId) || 'unknown';
      }
    });

    this.subgraphNode.forEach((extInfo, id) => {
      graph.nodes.push({
        ...extInfo,
        id: id.toString(),
        subgraph: true,
      })
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
          this.currentSubgraphIds.push(child.id);
          this.parseChildren(child.children, child, null, child.id);
          this.maybeFillLabelWhenEmpty(child);
          this.currentSubgraphIds.pop();
          break;
        case "node_id":
          this.createNodeId(child, parent, children as NodeId[], index, attrs, graphId);
          break;
        case "attr_stmt":
          // todo: add support for attrs
          if (child.attr_list && parent.type === "subgraph") {
            const attrs: any = this.parseAttrs(child.attr_list);
            if (attrs['label']) {
              const parentId = this.tryGetSubgraphNodeId();
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.subgraphNode.set(parent.id!, {
                ...parentId,
                label: attrs['label'],
              });
            }
          }
          break;
        default:
          console.error("unsupported type" + JSON.stringify(child))
      }
    })
  }

  private tryGetSubgraphNodeId() {
    let parentId: any = {};
    if (this.currentSubgraphIds.length > 0) {
      parentId = {
        data: {
          parentId: this.currentSubgraphIds[this.currentSubgraphIds.length - 2]
        }
      };
    }

    return parentId;
  }

  // attributes will parse before label, so if we have label, we don't want to override it
  private maybeFillLabelWhenEmpty(child: Subgraph) {
    if (!child.id) {
      return;
    }

    const isAlreadyContainLabel = !this.subgraphNode.has(child.id!);
    if (isAlreadyContainLabel) {
      const parentId = this.tryGetSubgraphNodeId();
      this.subgraphNode.set(child.id!, {
        ...parentId,
        label: child.id!.toString(),
      });
    }
  }

  private createNodeId(child: NodeId, parent: DotElement | DotGraph, children: NodeId[], index: number, attrs?: any, graphId?: string | number | undefined) {
    const nodeId = child.id;

    if (graphId) {
      attrs.parentId = graphId;
    }

    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId.toString(),
        label: child.id.toString(),
        props: this.mappingProperty(attrs),
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
          props: Object.assign({
            decorator: {
              arrowSize: 6,
              lineType: LineType.LINE,
              lineDashStyle: LineDashStyle.SOLID,
              endArrowhead: Arrowhead.NOTCHED,
              startArrowhead: Arrowhead.NONE
            },
          }, this.mappingProperty(attrs)),
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

  private mappingProperty(attrsMap: object): ElementProperty {
    if (!attrsMap) {
      return {};
    }

    const props: ElementProperty = {};

    for (const key in attrsMap) {
      const value: string | HTMLString = (attrsMap as any)[key];

      switch (key) {
        case "color":
          props.color = value.toString();
          break;
        case "fillcolor":
          if (props.fill) {
            props.fill.color = value.toString();
          } else {
            props.fill = {
              color: value.toString(),
            };
          }
          break;
        default:
        // do nothing;
      }
    }

    return props;
  }

  private createNode(child: NodeStmt, graphId: string | number | undefined) {
    const nodeId = child.node_id.id;
    const data: any = this.parseAttrs(child.attr_list);

    if (graphId) {
      data.parentId = graphId;
    }

    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId.toString(),
        label: data.label ? data.label : nodeId.toString(),
        props: this.mappingProperty(data),
        data: {
          ...data
        },
      });
    }
  }
}
