import * as dagre from 'dagre'
import { Point } from "../model/geometry/point";

export function feakinExporter(): string {
  return 'feakin-exporter';
}

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

// todo: refs to mermaid
export function dagreLayout(relations: DagreRelation[]) {
  const graph = new dagre.graphlib.Graph();

  graph.setGraph({});
  graph.setDefaultEdgeLabel(function () {
    return {};
  });

  relations.forEach(relation => {
    graph.setNode(relation.source.name, {});

    if(relation.target) {
      graph.setNode(relation.target.name, {});
      graph.setEdge(relation.source.name, relation.target.name, {});
    }
  })

  dagre.layout(graph);

  const nodes: BaseNode[] = [];
  graph.nodes().forEach(function (v) {
    // todo: add converter;
    nodes.push(graph.node(v));
  });

  const edges: BaseEdge[] = [];
  graph.edges().forEach(function (e) {
    // todo: add converter;
    edges.push(graph.edge(e.v, e.w, e.name));
  });

  return {
    nodes, edges
  }
}


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

export function fromDagre(node: dagre.Node<string>): BaseNode {
  return node;
}
