import * as dagre from "dagre";

export interface Definition {
  label: string,
  width: number,
  height: number
}

export interface NodeDefinition {
  id: string;
  definition: Definition
}

type Point = { x: number; y: number };
const flattenPoints = (points: Point[]): number[] => {
  const flatten: number[] = [];
  points.forEach(({ x, y }) => flatten.push(x, y));
  return flatten;
};


// refs: https://codesandbox.io/s/g72t3?file=/src/index.tsx
export const fkDagre = (nodeDefinitions: NodeDefinition[], relations: any[]) => {
  var g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    align: "UL",
    ranker: "network-simplex"
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel((v, w) => {
    return { label: `${ v.slice(0, 2) }-${ w.slice(0, 2) }` };
  });

  nodeDefinitions.forEach(({ id, definition }) => g.setNode(id, definition));

  relations.forEach(([v, w]) => g.setEdge(v, w));

  dagre.layout(g);

  const nodes = g.nodes().map(node => {
    return g.node(node)
  });

  const edges = g.edges().map(item => {
    let edge = g.edge(item);
    let points = flattenPoints(edge.points);
    console.log(points);
    return edge
  });

  return {
    nodes,
    edges
  }
};
