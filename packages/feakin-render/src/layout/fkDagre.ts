import * as dagre from 'dagre';
import { flattenPoints, NodeDefinition } from './fkLayoutDef';

interface FkDagreOptions {
  // TB = top to bottom, LR = left to right.
  dir?: 'TB' | 'BT' | 'LR' | 'RL';
}

export const fkDagre = (
  nodeDefinitions: NodeDefinition[],
  relations: any[],
  options?: FkDagreOptions
) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: options && options.dir ? options.dir : 'TB',
    align: 'UL',
    ranker: 'network-simplex',
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel((v, w) => {
    return { label: `${v.slice(0, 2)}-${w.slice(0, 2)}` };
  });

  nodeDefinitions.forEach(({ id, definition }) => g.setNode(id, definition));

  relations.forEach(([v, w]) => g.setEdge(v, w));

  // todo: export redraw function
  dagre.layout(g);

  const nodes = g.nodes().map((node) => {
    return g.node(node);
  });

  const edges = g.edges().map((item) => {
    let edge = g.edge(item);
    let points = flattenPoints(edge.points);

    return {
      props: edge,
      points,
    };
  });

  const connectors: any[] = [];

  return {
    nodes,
    edges,
    connectors,
  };
};
