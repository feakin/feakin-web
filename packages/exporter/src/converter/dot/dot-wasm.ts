import { GraphvizJson } from "../../graphviz-json";
import { Graph, Node } from "../../model/graph";

export function GraphvizToGim(graphviz: GraphvizJson): Graph {
  const graph: Graph = {
    nodes: [],
    edges: [],
    props: {},
  };

  const nodeMap: Map<string, Node> = new Map();

  if (graphviz.objects) {
    graphviz.objects.forEach((obj) => {
      const node = {
        id: obj._gvid.toString(),
        label: obj.name,
        props: {},
      };
      graph.nodes.push(node);
      nodeMap.set(node.id.toString(), node);
    });
  }

  if (graphviz.edges) {
    graphviz.edges.forEach((edge) => {
      graph.edges.push({
        id: edge._gvid.toString(),
        points: [
        ],
        data: {
          source: nodeMap.get(edge.tail.toString())?.label || "",
          target: nodeMap.get(edge.head.toString())?.label || "",
          sourceId: edge.tail.toString(),
          targetId: edge.head.toString(),
        },
        props: {}
      });
    });
  }

  return graph;
}
