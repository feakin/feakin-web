import { MXCell, Mxfile, MxGraph, MxPoint } from "./mxgraph";
import { Edge, ElementProperty, Graph, Node, NodeData } from "../../model/graph";
import { Importer } from "../importer";
import DrawioEncode from "./encode/drawio-encode";
import { ShapeType } from "../../model/node/base/shape-type";
import { CellState } from "./cell-state";

export class DrawioImporter extends Importer {
  private mxCells: MXCell[];
  private graph: MxGraph;
  private withoutHead: boolean;

  constructor(data: string, withoutHead = false) {
    super(data);
    this.withoutHead = withoutHead;

    if (!withoutHead) {
      const decoded: Mxfile | any = DrawioEncode.decodeXml(data);
      this.graph = DrawioEncode.xml2obj(decoded) as MxGraph;
    } else {
      this.graph = DrawioEncode.xml2obj(data) as MxGraph;
    }

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

    const needUpdatedEdges: Edge[] = [];
    const edgeMap: Map<string, Edge> = new Map<string, Edge>();
    const nodeMap: Map<string, Node> = new Map<string, Node>();

    this.mxCells.forEach((cell: MXCell) => {
        const hasSourceAndTarget = cell.attributes?.source && cell.attributes?.target;
        if (hasSourceAndTarget || cell.attributes?.edge === "1") {
          const edge = this.convertEdge(cell);
          edgeMap.set(edge.id, edge);

          if (cell.attributes?.source && cell.attributes?.target) {
            if (!cell.mxGeometry?.mxPoint?.length) {
              needUpdatedEdges.push(edge);
            }
          }
        } else if (cell.attributes?.value) {
          const node = this.convertNode(cell);
          nodeMap.set(node.id, node);
          filtered.nodes.push(node);
        }
      }
    );

    needUpdatedEdges.forEach((edge: Edge) => {
      const source = {
        x: nodeMap.get(edge.data!.source)?.x || 0,
        y: nodeMap.get(edge.data!.source)?.y || 0,
      };
      const target = {
        x: nodeMap.get(edge.data!.target)?.x || 0,
        y: nodeMap.get(edge.data!.target)?.y || 0,
      };

      edge.points.push(source);
      edge.points.push(target);
    });

    filtered.nodes = Array.from(nodeMap.values());
    filtered.edges = Array.from(edgeMap.values());

    const maybeUpdateEdgeLabelPosition = filtered.nodes.filter(node => {
      const hasParent = node.data?.parentId && node.data?.parentId !== "1";
      return hasParent && (edgeMap.has(node.data!.parentId!));
    });
    if (maybeUpdateEdgeLabelPosition.length > 0) {
      this.fixEdgeLabelNotPositionIssue(maybeUpdateEdgeLabelPosition, edgeMap);
    }

    return filtered;
  }

  private fixEdgeLabelNotPositionIssue(nodes: Node[], cellMap: Map<string, Edge>) {
    nodes.forEach(node => {
      const parentNode: Edge | undefined = cellMap.get(node.data!.parentId!);
      if (parentNode?.points.length == 0) {
        return;
      }

      const startPoint = parentNode?.points[0];
      if (startPoint?.x && startPoint?.y) {
        node.x = startPoint?.x + (node.x ?? 0);
        node.y = startPoint?.y + (node.y ?? 0);
      }
    });
  }

  private convertEdge(cell: MXCell): Edge {
    const attrs = cell.attributes!;

    let props: ElementProperty = {}
    if(cell.attributes?.style) {
      props = CellState.toEdgeStyle(CellState.fromString(cell.attributes?.style));
    }

    return {
      id: attrs.id,
      label: attrs.value,
      points: this.normalPointsForEdge(cell),
      controlPoints: this.controlPointsForEdge(cell),
      width: parseFloat(String(cell?.mxGeometry?.attributes?.width || 0)),
      height: parseFloat(String(cell?.mxGeometry?.attributes?.height || 0)),
      props: props,
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

    const ext: NodeData = {};

    if (cell.attributes?.parent != "1") {
      ext.parentId = cell.attributes?.parent;
    }

    if (attrs.connectable == "0") {
      ext.shape = ShapeType.Text;
    }

    return {
      id: attrs.id,
      label: attrs.value || '',
      x: point.x,
      y: point.y,
      width: parseFloat(String(geoAttrs?.width || 0)),
      height: parseFloat(String(geoAttrs?.height || 0)),
      props: CellState.toEdgeStyle(CellState.fromString(cell.attributes?.style || "")),
      data: ext
    };
  }
}
