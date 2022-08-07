import * as dagre from 'dagre'
import { Point } from "../model/geometry/point";
import { defaultLayoutOptions, Layout, LayoutOptions } from "../model/layout";

export interface Label {
  name: string;
  label?: string
}

export type SourceElement = Label
export type TargetElement = Label

export interface DagreRelation {
  source: SourceElement;
  target?: TargetElement;
}

export function dagreLayout(relations: DagreRelation[], options?: LayoutOptions): LayoutOutput {
  options = options || defaultLayoutOptions;

  const graph = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true,
  }).setGraph({
    rankdir: options?.rankdir,
    nodesep: 50,
    ranksep: 50,
    marginx: 8,
    marginy: 8,
  }).setDefaultEdgeLabel(() => ({}));

  relations.forEach(relation => {
    graph.setNode(relation.source.name, {
      width: options?.node?.width || 0,
      height: options?.node?.height || 0,
    });

    if (relation.target) {
      graph.setNode(relation.target.name, {});
      graph.setEdge(relation.source.name, relation.target.name, {});
    }
  })

  dagre.layout(graph);

  const nodes: BaseNode[] = [];
  graph.nodes().forEach(function (v) {
    nodes.push(graph.node(v));
  });

  const edges: BaseEdge[] = [];
  graph.edges().forEach(function (e) {
    edges.push(graph.edge(e.v, e.w, e.name));
  });

  return {
    nodes, edges
  }
}


// todo: merge to elements;
export interface BaseEdge {
  points: Point[]
}

export interface Valued {
  label?: string;
}

export interface BaseNode extends Point, Valued {
  width: number;
  height: number;
  padding?: number | undefined;
  paddingX?: number | undefined;
  paddingY?: number | undefined;
  rx?: number | undefined;
  ry?: number | undefined;
}

export interface LayoutOutput {
  nodes: BaseNode[];
  edges: BaseEdge[];
}