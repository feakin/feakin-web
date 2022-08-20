import { MXCell, MxGraph } from "./mxgraph";
import { Edge, Graph, Node } from "../../model/graph";
import { CellStateStyle } from "./cell-state-style";
import { Converter, FeakinConverter } from "../converter";

export class DrawioConverter extends Converter implements FeakinConverter {
  private mxCells: MXCell[];

  constructor(graph: MxGraph) {
    super(graph);
    this.mxCells = this.graph.mxGraphModel.root.mxCell;
  }

  convert(): Graph {
    const graphAttrs = this.graph.mxGraphModel?.attributes;
    const filtered: Graph = {
      nodes: [],
      edges: [],
      props: {
        width: parseFloat(<string>graphAttrs?.pageWidth) || 0,
        height: parseFloat(<string>graphAttrs?.pageHeight) || 0,
      },
    };

    this.mxCells.forEach((cell: MXCell) => {
        if (cell.attributes?.source && cell.attributes?.target) {
          filtered.edges.push(this.convertEdge(cell));
        } else if (cell.attributes?.value) {
          filtered.nodes.push(this.convertNode(cell));
        }
      }
    );

    return filtered;
  }

  parseStyle(style: string): CellStateStyle {
    const styles = style.split(";");
    const parsed: any = {};

    styles.forEach((style: string) => {
        const [key, value] = style.split("=");
        parsed[key] = value;
      }
    );

    return parsed;
  }

  private convertEdge(cell: MXCell): Edge {
    const attrs = cell.attributes!;

    return {
      id: attrs.id,
      label: attrs.value,
      points: this.calPointsForEdge(cell),
      data: {
        source: attrs.source!,
        target: attrs.target!,
        width: parseFloat(String(cell?.mxGeometry?.attributes?.width || 0)),
        height: parseFloat(String(cell?.mxGeometry?.attributes?.height || 0)),
      }
    };
  }

  private calPointsForEdge(cell: MXCell) {
    const mxPoint = cell.mxGeometry?.mxPoint;
    if (!mxPoint) {
      return [];
    }

    return mxPoint?.map((point: any) => {
      return {
        x: parseFloat(point.attributes.x || 0),
        y: parseFloat(point.attributes.y || 0)
      }
    }) || [];
  }

  private convertNode(cell: MXCell): Node {
    const attrs = cell.attributes!;
    const geoAttrs = cell.mxGeometry?.attributes;

    const point = {
      x: parseFloat(String(geoAttrs?.x || 0)),
      y: parseFloat(String(geoAttrs?.y || 0)),
    }

    return {
      id: attrs.id,
      label: attrs.value,
      x: point.x,
      y: point.y,
      width: parseFloat(String(geoAttrs?.width || 0)),
      height: parseFloat(String(geoAttrs?.height || 0)),
    };
  }
}
