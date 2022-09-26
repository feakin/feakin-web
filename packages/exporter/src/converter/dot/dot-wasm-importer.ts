import { graphvizSync } from "@hpcc-js/wasm";

import { Drawops, GraphvizJson, Polygon, Pos } from "../../graphviz-json";
import { defaultEdgeProperty, Graph, Node } from "../../model/graph";
import { Importer } from "../importer";
import { Point } from "../../model/geometry/point";
import { ShapeType } from "../../model/node/base/shape-type";

export class DotWasmImporter extends Importer {
  override isPromise = true;

  override async parsePromise(): Promise<Graph> {
    const output = await graphvizSync().then(async (graph) => {
      return graph.layout(this.content, "json");
    });

    const model = GraphvizToGim(JSON.parse(output));
    return model;
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

function pointsFrom(_draw_: Drawops | undefined): Point[] {
  if (_draw_ === undefined) {
    return [];
  }
  const pointOp = _draw_.filter(op => op.op === "P");
  if (pointOp.length <= 0) {
    return [];
  } else {
    const pointOpElement = pointOp[0]!;
    return (pointOpElement as Polygon).points.map((point: any[]) => {
      return {x: point[0], y: point[1]};
    });
  }
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
      const width = parseFloat( <string>obj['width']);
      const height = parseFloat(<string>obj['height']);

      const node: Node = {
        id: obj._gvid.toString(),
        label: obj.name,
        x: loc.x,
        y: loc.y,
        width: width,
        height: height,
        //  todo: change to polygon?
        data: {
          shape: ShapeType.Polygon,
          points: pointsFrom(obj._draw_),
        }
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
        props: defaultEdgeProperty
      });
    });
  }

  return graph;
}
