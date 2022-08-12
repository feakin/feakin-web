import * as dagre from 'dagre'
import { defaultLayoutOptions, LayoutOptions } from "../model/abstract/layout";
import { DagreRelation } from "./dagre-relation";
import { Node, Edge, Graph } from "../model/graph";

export function dagreLayout(relations: DagreRelation[], options?: LayoutOptions): Graph {
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

  const nodes: Node[] = [];
  graph.nodes().forEach(function (v) {
    let node = graph.node(v);
    nodes.push({
      x: node.x,
      y: node.y,
      label: node.label,
      height: node.height,
      width: node.width
    });
  });

  const edges: Edge[] = [];
  graph.edges().forEach(function (e) {
    let graphEdge = graph.edge(e);
    edges.push({
      points: graphEdge.points,
    });
  });

  return {
    nodes, edges
  }
}
