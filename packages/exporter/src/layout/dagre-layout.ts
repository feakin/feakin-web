import * as dagre from 'dagre'
import { Node as DagreNode, GraphEdge } from "dagre";

import { DagreRelation } from "./dagre-relation";
import { Node, Edge, Graph } from "../model/graph";
import { defaultLayoutOptions, LayoutOptions } from "../model/layout/layout";
import { randomInteger } from "../renderer/drawn-style/rough-seed";
import { nanoid } from "nanoid";

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

  let labelCache: Map<string, boolean> = new Map();
  relations.forEach(relation => {
    labelCache.set(relation.source.name, true);

    if (relation.target) {
      labelCache.set(relation.target.name, true);
      graph.setEdge(relation.source.name, relation.target.name, {});
    }
  })

  labelCache.forEach((_, name) => {
    const label = {
      width: options.node.width,
      height: options.node.height,
    };
    graph.setNode(name, label);
  });

  dagre.layout(graph);

  const nodes: Node[] = [];
  graph.nodes().forEach(function (v) {
    const node: DagreNode = graph.node(v);
    nodes.push({
      id: nanoid(),
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
      id: nanoid(),
      points: graphEdge.points,
    });
  });

  return {
    nodes, edges
  }
}
