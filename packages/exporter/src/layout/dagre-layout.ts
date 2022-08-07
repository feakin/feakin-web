import * as dagre from 'dagre'
import { defaultLayoutOptions, LayoutOptions } from "../model/layout";
import { BaseEdge, BaseNode, DagreRelation, LayoutOutput } from "../model/layout-model";

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
