import * as dagre from 'dagre'
import { Node as DagreNode, GraphEdge, graphlib } from "dagre";

import { DagreRelation } from "./dagre-relation";
import { Node, Edge, Graph } from "../model/graph";
import { defaultLayoutOptions, LayoutOptions } from "../model/layout/layout";
import { nanoid } from "nanoid";

function initGraphOptions(options: LayoutOptions) {
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
  return graph;
}

function renderByPosition(graph: graphlib.Graph<any>) {
  dagre.layout(graph);

  const labelIdMap: Map<string, string> = new Map();
  const nodes: Node[] = [];
  graph.nodes().forEach(function (v) {
    const node: DagreNode<any> = graph.node(v);
    const nodeId = node['id'] ? node['id'] : nanoid();
    labelIdMap.set(v, nodeId);
    nodes.push({
      id: nodeId,
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
      id: graphEdge['id'] ? graphEdge['id'] : nanoid(),
      points: graphEdge.points,
      data: {
        source: labelIdMap.get(e.v) || e.v,
        target: labelIdMap.get(e.w) || e.w,
      }
    });
  });

  return {
    nodes, edges
  }
}

export function dagreLayout(relations: DagreRelation[], options: LayoutOptions = defaultLayoutOptions): Graph {
  const graph = initGraphOptions(options);

  const labelCache: Map<string, boolean> = new Map();
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

  return renderByPosition(graph);
}
