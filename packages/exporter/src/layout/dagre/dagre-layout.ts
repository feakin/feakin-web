import * as dagre from 'dagre'
import { GraphEdge, graphlib, Node as DagreNode } from 'dagre'

import { SimpleNetwork } from "../simple-network";
import { Edge, Graph, Node } from "../../model/graph";
import { nanoid } from "nanoid";
import { defaultLayoutOptions, LayoutOptions } from "../../model/layout/layout-options";

function initGraphOptions(options: LayoutOptions) {
  const graph = new graphlib.Graph({
    multigraph: true,
    compound: true,
  });

  graph.setGraph({ rankdir: options.direction });
  graph.setDefaultEdgeLabel(() => ({}));

  return graph;
}

export function layoutFromGraph(graph: Graph, options: LayoutOptions = defaultLayoutOptions): Graph {
  const rootGraph = initGraphOptions(options);

  // create parent graph first;
  graph.nodes.filter(node => node.subgraph).forEach(subgraph => {
    rootGraph.setNode(subgraph.id!, {
      ...subgraph
    });

    if (subgraph.data?.parentId) {
      rootGraph.setParent(subgraph.id, subgraph.data?.parentId);
    }
  });

  graph.nodes.forEach(node => {
    if (node.subgraph) {
      return;
    }

    rootGraph.setNode(node.label, {
      ...node,
      width: options.node.width,
      height: options.node.height
    });

    if (node.data?.parentId) {
      rootGraph.setParent(node.label, node.data?.parentId);
    }
  })

  graph.edges.forEach(edge => {
    if (edge.data) {
      rootGraph.setEdge(edge.data?.source, edge.data?.target, {
        ...edge
      });
    }
  })

  return runLayout(rootGraph);
}

export function dagreLayout(relations: SimpleNetwork[], options: LayoutOptions = defaultLayoutOptions): Graph {
  const dagreGraph = initGraphOptions(options);

  const labelCache: Map<string, boolean> = new Map();
  relations.forEach(relation => {
    labelCache.set(relation.source.name, true);

    if (relation.target) {
      labelCache.set(relation.target.name, true);
      dagreGraph.setEdge(relation.source.name, relation.target.name, {});
    }
  })

  labelCache.forEach((_, name) => {
    const label = {
      width: options.node.width,
      height: options.node.height,
    };

    dagreGraph.setNode(name, label);
  });

  return runLayout(dagreGraph);
}

/**
 * Calculate the position of nodes and edges in the graph.
 * @param graph
 */
export function runLayout(graph: graphlib.Graph<any>): Graph {
  dagre.layout(graph);

  const labelIdMap: Map<string, string> = new Map();
  const nodes: Node[] = [];
  graph.nodes().forEach(function (v) {
    const node: DagreNode<any> = graph.node(v);
    const nodeId = node['id'] ? node['id'] : nanoid();
    labelIdMap.set(v, nodeId);

    if (node.subgraph) {
      nodes.push({
        ...node,
        id: nodeId,
        label: node.label,
        x: node.x - node.width / 2,
        y: node.y - node.height / 2,
        height: node.height,
        width: node.width,
        subgraph: true
      });
    } else {
      nodes.push({
        ...node,
        id: nodeId,
        x: node.x - node.width / 2,
        y: node.y - node.height / 2,
        label: v,
        height: node.height,
        width: node.width
      });
    }
  });

  const edges: Edge[] = [];
  graph.edges().forEach(function (e) {
    const graphEdge: GraphEdge = graph.edge(e);
    edges.push({
      id: graphEdge['id'] ? graphEdge['id'] : nanoid(),
      points: graphEdge.points,
      props: graphEdge['props'],
      data: {
        ...graphEdge['data'],
        source: labelIdMap.get(e.v) || e.v,
        target: labelIdMap.get(e.w) || e.w
      }
    });
  });

  return {
    nodes,
    edges,
    props: {
      width: graph.graph().width,
      height: graph.graph().height
    }
  }
}
