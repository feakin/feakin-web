import { Importer } from "../importer";
import { Edge, Graph, Node } from "../../model/graph";
import { ImportedDataState } from "./excalidraw-types";
import { nestedPoints } from "../../model/geometry/point";
import { ShapeType } from "../../model/node/base/shape-type";

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
          let edge: Edge = {
            id: element.id,
            points: nestedPoints(element.points as any),
          }

          if (element.startBinding && element.endBinding) {
            Object.assign(edge, {
              data: {
                source: element.startBinding.elementId,
                target: element.endBinding.elementId
              }
            })
          }

          edgeMap.set(edge.id, edge);
          graph.edges.push(edge);
      }
    });

    return graph;
  }
}
