import { MXCell, Mxfile, MxGraph, MxPoint } from "./mxgraph";
import { Edge, Graph, Node } from "../../model/graph";
import { CellStateStyle } from "./cell-state-style";
import { Importer } from "../importer";
import DrawioEncode from "./encode/drawio-encode";

export class DrawioImporter extends Importer {
  private mxCells: MXCell[];
  private graph: MxGraph;

  constructor(data: string) {
    super(data);

    const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
    this.graph = DrawioEncode.xml2obj(encoded) as MxGraph;
    this.mxCells = this.graph.mxGraphModel.root.mxCell;
  }

  override parse(): Graph {
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
      const hasSourceAndTarget = cell.attributes?.source && cell.attributes?.target;
      if (hasSourceAndTarget || cell.attributes?.edge === "1") {
          filtered.edges.push(this.convertEdge(cell));
        } else if (cell.attributes?.value) {
          filtered.nodes.push(this.convertNode(cell));
        }
      }
    );

    return filtered;
  };

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
      points: this.normalPointsForEdge(cell),
      controlPoints: this.controlPointsForEdge(cell),
      width: parseFloat(String(cell?.mxGeometry?.attributes?.width || 0)),
      height: parseFloat(String(cell?.mxGeometry?.attributes?.height || 0)),
      data: {
        source: attrs.source!,
        target: attrs.target!
      }
    };
  }

  private controlPointsForEdge(cell: MXCell) {
    let mxPoints: MxPoint[] = [];

    const controlPoint = cell.mxGeometry?.Array?.mxPoint;
    if (controlPoint) {
      mxPoints = Array.isArray(controlPoint) ? controlPoint : [controlPoint];
    }

    return this.pointsFromMxPoints(mxPoints);
  }

  private normalPointsForEdge(cell: MXCell) {
    let mxPoints: MxPoint[] = [];

    const sourceAndTargetPoints = cell.mxGeometry?.mxPoint;
    if (sourceAndTargetPoints) {
      mxPoints = mxPoints.concat(cell.mxGeometry!.mxPoint!);
    }

    return this.pointsFromMxPoints(mxPoints);
  }

  private pointsFromMxPoints(mxPoints: MxPoint[]) {
    if (mxPoints.length === 0) {
      return [];
    }

    return mxPoints.map((point: MxPoint) => {
      return {
        x: parseFloat(<string>point.attributes?.x),
        y: parseFloat(<string>point.attributes?.y)
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
