import * as dagre from 'dagre'
import { Node as DagreNode, GraphEdge } from "dagre";

import { DagreRelation } from "./dagre-relation";
import { Node, Edge, Graph } from "../model/graph";
import { defaultLayoutOptions, LayoutOptions } from "../model/layout/layout";

export function dagreLayout(relations: DagreRelation[], options: LayoutOptions = defaultLayoutOptions): Graph {
  const graph = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true,
  }).setGraph({
    rankdir: options.rankdir,
    nodesep: 50,
    ranksep: 50,
    marginx: 8,
    marginy: 8,
  }).setDefaultEdgeLabel(() => ({}));

  relations.forEach(relation => {
    const label = {
      width: options.node.width,
      height: options.node.height,
    };
    graph.setNode(relation.source.name, label);

    if (relation.target) {
      graph.setNode(relation.target.name, label);
      graph.setEdge(relation.source.name, relation.target.name, {});
    }
  })

  dagre.layout(graph);

  const nodes: Node[] = [];
  graph.nodes().forEach(function (v) {
    const node: DagreNode = graph.node(v);
    nodes.push({
      x: node.x,
      y: node.y,
      label: v,
      height: node.height,
      width: node.width
    });
  });

  const edges: Edge[] = [];
  graph.edges().forEach(function (e) {
    const graphEdge: GraphEdge = graph.edge(e);
    edges.push({
      id: "1",
      points: graphEdge.points,
    });
  });

  return {
    nodes, edges
  }
}
