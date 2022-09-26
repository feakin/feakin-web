import { graphvizSync } from "@hpcc-js/wasm";
import { nanoid } from "nanoid";

import { Drawops, Ellipse, GraphvizJson, NodeOrSubgraph, Polygon, Pos, Text } from "./graphviz-json";
import { defaultEdgeProperty, ElementProperty, Graph, Node } from "../../model/graph";
import { Importer } from "../importer";
import { Point } from "../../model/geometry/point";
import { ShapeType } from "../../model/node/base/shape-type";

export class DotWasmImporter extends Importer {
  override isPromise = true;
  trailingCommaRegex = /,(?!\s*?[{["'\w])/g;

  override async parsePromise(): Promise<Graph> {
    let output = await graphvizSync().then(async (graph) => {
      return graph.layout(this.content, "json");
    });

    try {
      output = JSON.parse(output.replace(this.trailingCommaRegex, ''));
    } catch (e) {
      console.error(e);
      return {
        nodes: [],
        edges: [],
      } as Graph;
    }

    return this.graphvizToGim(output as unknown as GraphvizJson);
  }

  static parseGraphvizPos(pos_str: Pos | undefined): Point[] {
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

  rectToPoints(rect: [number, number, number, number]): Point[] {
    const [centerX, centerY, width, height] = rect;
    const x = centerX - width;
    const y = centerY - height;

    return [
      {x: x, y: y},
      {x: x + width * 2, y: y},
      {x: x + width * 2, y: y + height * 2},
      {x: x, y: y + height * 2},
    ];
  }

  pointsFrom(_draw_: Drawops | undefined): Point[] {
    if (_draw_ === undefined) {
      return [];
    }

    for (const element of _draw_) {
      if (element.op === "P" || element.op === "p") {
        const polygon = element as Polygon;

        return polygon.points.map((point: any[]) => {
          return {x: point[0], y: point[1]};
        });
      } else if (element.op === "e") {
        const polyline = element as Ellipse;
        return this.rectToPoints(polyline.rect);
      }
    }

    return [];
  }

  labelFromDraw(_draw_: Drawops | undefined) {
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

  propFromObj(obj: NodeOrSubgraph): ElementProperty {
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

  shapeFromDraw(_draw_: Drawops | undefined): ShapeType {
    if (_draw_ === undefined) {
      return ShapeType.Ellipse;
    }

    let shape = ShapeType.Polygon;
    for (const element of _draw_) {
      if (element.op === "e") {
        shape = ShapeType.Ellipse;
      }
    }

    return shape;
  }

  shapePointsFrom(_draw_: Drawops | undefined): number[] {
    if (_draw_ === undefined) {
      return [];
    }

    for (const element of _draw_) {
      if (element.op === "e") {
        const ellipse = element as Ellipse;
        return ellipse.rect;
      }
    }

    return [];
  }

  graphvizToGim(graphviz: GraphvizJson): Graph {
    const graph: Graph = {
      nodes: [],
      edges: [],
      props: {},
    };

    const nodeMap: Map<string, Node> = new Map();

    if (graphviz.objects) {
      graphviz.objects.forEach((obj: NodeOrSubgraph) => {
        const location = DotWasmImporter.parseGraphvizPos(obj.pos)[0];
        let width = parseFloat(<string>obj['width']);
        let height = parseFloat(<string>obj['height']);

        const labelInfo = this.labelFromDraw(obj._ldraw_);
        const shape: ShapeType = this.shapeFromDraw(obj._draw_);

        const shapePoints = this.shapePointsFrom(obj._draw_);
        if (shape == ShapeType.Ellipse) {
          width = shapePoints[2];
          height = shapePoints[3];
        }

        const newId: string = nanoid();
        const originId = obj._gvid.toString();

        const node: Node = {
          id: newId,
          label: labelInfo.text,
          x: location.x,
          y: location.y,
          width: width,
          height: height,
          data: {
            shape: shape,
            originId: originId,
            points: this.pointsFrom(obj._draw_),
            labelPosition: labelInfo.position,
          },
          props: this.propFromObj(obj),
        };

        graph.nodes.push(node);
        nodeMap.set(originId, node);
      });
    }

    if (graphviz.edges) {
      graphviz.edges.forEach((edge) => {
        const originId = edge._gvid.toString();

        const sourceNode = nodeMap.get(edge.tail.toString());
        const targetNode = nodeMap.get(edge.head.toString());

        graph.edges.push({
          id: nanoid(),
          points: DotWasmImporter.parseGraphvizPos(edge.pos),
          data: {
            originId,
            source: sourceNode?.label || "",
            target: targetNode?.label || "",
            sourceId: sourceNode?.id || "",
            targetId: targetNode?.id || "",
          },
          props: defaultEdgeProperty
        });
      });
    }

    return graph;
  }
}
