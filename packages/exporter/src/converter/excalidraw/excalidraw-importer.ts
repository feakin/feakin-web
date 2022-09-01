import { Importer } from "../importer";
import { Edge, Graph, Node } from "../../model/graph";
import { ExArrowhead, ExcalidrawLinearElement, ImportedDataState, StrokeStyle } from "./excalidraw-types";
import { nestedPoints } from "../../model/geometry/point";
import { ShapeType } from "../../model/node/base/shape-type";
import { defaultEdgeDecorator } from "../../model/edge/decorator/edge-decorator";
import { LineStyle } from "../../model/edge/decorator/line-style";
import { LineDashStyle } from "../../model/edge/decorator/line-dash-style";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";

export class ExcalidrawImporter extends Importer {
  private data: ImportedDataState;

  constructor(content: string) {
    super(content);
    this.data = JSON.parse(content);
  }

  override parse(): Graph {
    const graph: Graph = {
      nodes: [],
      edges: [],
      props: {
        width: 0,
        height: 0,
      },
    };

    const nodeMap: Map<string, Node> = new Map();
    const edgeMap: Map<string, Edge> = new Map();

    this.data.elements?.forEach((element) => {
      switch (element.type) {
        case "text":
        case "ellipse":
        case "diamond":
        case "rectangle":
          // eslint-disable-next-line no-case-declarations
          let node: Node = {
            id: element.id,
            label: "",
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height
          };
          nodeMap.set(node.id, node);
          graph.nodes.push(node);

          if (element.type === "text") {
            node.label = element.text;
            node.data = {
              shape: ShapeType.Text
            }
          }

          break;
        case "freedraw":
          break;
        case "image":
          break;
        case "line":
        case "arrow":
          // eslint-disable-next-line no-case-declarations
          let edge = this.convertEdge(element);
          edgeMap.set(edge.id, edge);
          graph.edges.push(edge);
      }
    });

    return graph;
  }

  private convertEdge(element: ExcalidrawLinearElement): Edge {
    const edge: Edge = {
      id: element.id,
      props: {},
      points: nestedPoints(element.points as any).map((p) => {
        return {
          x: p.x + element.x,
          y: p.y + element.y
        };
      }),
    }

    Object.assign(edge.props!, {
      fill: {
        color: element.strokeColor,
        transparent: element.opacity === 0,
        opacity: element.opacity
      },
      decorator: {
        lineType: LineStyle.STRAIGHT,
        lineDashStyle: this.exToLineStyle(element.strokeStyle),
        startArrowhead: this.exArrowToArrowhead(element.startArrowhead),
        endArrowhead: this.exArrowToArrowhead(element.endArrowhead),
      },
      stroke: {
        color: element.strokeColor,
        width: element.strokeWidth,
        opacity: 1,
      }
    })

    if (element.startBinding && element.endBinding) {
      Object.assign(edge, {
        data: {
          source: element.startBinding.elementId,
          target: element.endBinding.elementId
        }
      })
    }

    return edge;
  }

  private exToLineStyle(strokeStyle: StrokeStyle): LineDashStyle {
    switch (strokeStyle) {
      case "solid":
        return LineDashStyle.SOLID;
      case "dashed":
        return LineDashStyle.DASH;
      case "dotted":
        return LineDashStyle.DOT;
    }
  }

  private exArrowToArrowhead(startArrowhead: ExArrowhead | null): Arrowhead {
    if (startArrowhead === null) {
      return Arrowhead.NONE;
    }

    switch (startArrowhead) {
      case "triangle":
        return Arrowhead.HOLLOW;
      case "arrow":
        return Arrowhead.FILLED;
      case "dot":
        return Arrowhead.FILLED_CIRCLE;
      case "bar":
        return Arrowhead.FILLED_SQUARE;

    }
  }
}
