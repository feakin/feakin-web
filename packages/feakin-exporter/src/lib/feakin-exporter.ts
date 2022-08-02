import * as dagre from 'dagre'
import { Point } from "../model/geometry/point";

export function feakinExporter(): string {
  return 'feakin-exporter';
}

export interface DagreRelation {
  source: string;
  target: string;
}

// todo: refs to mermaid
export function dagreLayout() {
  const g = new dagre.graphlib.Graph();

  g.setGraph({});
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  g.setNode("kspacey", { label: "Kevin Spacey" });
  g.setNode("swilliams", { label: "Saul Williams" });

  g.setEdge("hford", "lwilson");
  g.setEdge("lwilson", "kbacon");

  dagre.layout(g);

  const nodes: BaseNode[] = [];
  g.nodes().forEach(function (v) {
    // todo: add converter;
    nodes.push(g.node(v));
  });

  const edges: BaseEdge[] = [];
  g.edges().forEach(function (e) {
    // todo: add converter;
    edges.push(g.edge(e));
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
