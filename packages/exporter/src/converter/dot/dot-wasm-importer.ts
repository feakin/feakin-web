import { GraphvizJson, Pos } from "../../graphviz-json";
import { Graph, Node } from "../../model/graph";
import { Importer } from "../importer";
import { Point } from "../../model/geometry/point";
import { graphviz } from "@hpcc-js/wasm";

export class DotWasmImporter extends Importer {
  override isPromise = true;

  override async parsePromise(): Promise<Graph> {
    const output = await graphviz.layout(this.content, "json");
    return GraphvizToGim(JSON.parse(output));
  }
}

export function parseGraphvizPos(pos_str: Pos | undefined): Point[] {
  const pos: string = pos_str ? pos_str : "0,0";
  const pointList = pos?.split(" ") || ["0,0"];
  return pointList.map((point) => {
    if (point.startsWith("e,")) {
      point = point.replace("e,", "");
    }
    if (point.startsWith("s,")) {
      point = point.replace("s,", "");
    }

    const [x, y] = point.split(",");
    return {x: parseFloat(x), y: parseFloat(y)};
  });
}

export function GraphvizToGim(graphviz: GraphvizJson): Graph {
  const graph: Graph = {
    nodes: [],
    edges: [],
    props: {},
  };

  const nodeMap: Map<string, Node> = new Map();

  if (graphviz.objects) {
    graphviz.objects.forEach((obj) => {
      const loc = parseGraphvizPos(obj.pos)[0];
      const node: Node = {
        id: obj._gvid.toString(),
        label: obj.name,
        x: loc.x,
        y: loc.y,
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
        points: parseGraphvizPos(edge.pos),
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
