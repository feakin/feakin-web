import { graphvizSync } from "@hpcc-js/wasm";

import { Drawops, GraphvizJson, NodeOrSubgraph, Polygon, Pos, Text } from "../../graphviz-json";
import { defaultEdgeProperty, ElementProperty, Graph, Node } from "../../model/graph";
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
  const pointOp = _draw_.filter(op => (op.op === "P" || op.op === "p"));
  if (pointOp.length <= 0) {
    return [];
  } else {
    const pointOpElement = pointOp[0]!;
    return (pointOpElement as Polygon).points.map((point: any[]) => {
      return {x: point[0], y: point[1]};
    });
  }
}

function labelFromDraw(_draw_: Drawops | undefined) {
  const text = "";
  if (_draw_ === undefined) {
    return {
      text: text,
      position: {x: 0, y: 0}
    };
  }

  const pointOp = _draw_.filter(op => (op.op === "T"));
  if (pointOp.length <= 0) {
    return {
      text: text,
      position: {x: 0, y: 0}
    };
  }
  const textNode = pointOp[0]! as Text;
  const pointOpElement = textNode.pt;

  const offset = textNode.width / 2;

  return {
    text: textNode.text,
    position: {x: pointOpElement[0] - offset, y: pointOpElement[1]}
  };
}

function propFromObj(obj: NodeOrSubgraph): ElementProperty {
  const props = Object.assign({}, defaultEdgeProperty);
  let filled = false;
  if (obj['style']) {
    filled = (<string>obj.style).includes("filled")
  }

  if (filled) {
    obj._draw_?.forEach((op) => {
      switch (op.op) {
        case "c":
          props.font = {
            fontColor: <string>op.color,
          };
          break;
        case "C":
          props.fill = {
            color: <string>op.color,
          };
          break;
        default:
          break;
      }
    });
  }

  return props;
}

export function GraphvizToGim(graphviz: GraphvizJson): Graph {
  const graph: Graph = {
    nodes: [],
    edges: [],
    props: {},
  };

  const nodeMap: Map<string, Node> = new Map();

  if (graphviz.objects) {
    graphviz.objects.forEach((obj: NodeOrSubgraph) => {
      const loc = parseGraphvizPos(obj.pos)[0];
      const width = parseFloat(<string>obj['width']);
      const height = parseFloat(<string>obj['height']);

      const labelInfo = labelFromDraw(obj._ldraw_);
      const node: Node = {
        id: obj._gvid.toString(),
        label: labelInfo.text,
        x: loc.x,
        y: loc.y,
        width: width,
        height: height,
        //  todo: change to polygon?
        data: {
          shape: ShapeType.Polygon,
          points: pointsFrom(obj._draw_),
          labelPosition: labelInfo.position,
        },
        props: propFromObj(obj),
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
