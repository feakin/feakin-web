import { Edge, ElementProperty, Graph, Node } from '../../model/graph';
import { randomInteger } from './helper/rough-seed';
import {
  calculateFocusAndGap,
  determineFocusPoint,
  getPointAtIndexGlobalCoordinates,
  intersectElementWithLine,
} from "./helper/collision";
import { FontString, measureText } from "./helper/text-utils";
import { isBrowser } from "../../env";
import { Exporter, Transpiler } from "../exporter";

export interface ExportedDataState {
  type: string;
  version: number;
  source: string;
  elements: any[];
  appState: any;
  files: any;
}

export class ExcalidrawExporter extends Exporter<ExportedDataState> implements Transpiler {
  originNodeCaches: Map<string, Node> = new Map<string, Node>();
  createdNodeCaches: Map<string, any> = new Map<string, any>();

  constructor(graph: Graph) {
    super(graph);
    this.graph = graph;
  }

  override export(): ExportedDataState {
    const root = this.createRoot();

    this.graph.nodes.forEach(node => {
      const rectangle: any = this.transpileNode(node);
      this.originNodeCaches.set(<string>node.id, node);
      this.createdNodeCaches.set(rectangle.id, rectangle);
    });

    this.createdNodeCaches.forEach((node) => {
      const newNode = node;
      const originNode = this.originNodeCaches.get(<string>node.id);
      if (originNode?.label) {
        const label = this.transpileLabel(originNode, node.id);
        root.elements.push(label);
        newNode.boundElements.push({
          id: label.id,
          type: "text"
        })
      }

      root.elements.push(node);
    });

    this.graph.edges.forEach(edge => {
      root.elements.push(this.transpileEdge(edge));
    });

    return root;
  }

  transpileStyle(prop: ElementProperty) {
    return "";
  }

  createRoot(): ExportedDataState {
    return {
      type: "excalidraw",
      version: 2,
      source: "https://feakin.com",
      elements: [],
      appState: {
        gridSize: null,
        viewBackgroundColor: "#ffffff"
      },
      files: {}
    }
  }

  transpileNode(node: Node): object {
    return this.createBaseNode(node);
  }

  transpileLabel(node: Node, id?: number): any {
    const labelNode = this.createBaseNode(node);
    labelNode.type = "text";

    Object.assign(labelNode, {
      id: randomInteger().toString(),
      text: node.label,
      fontSize: 20,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      baseline: 18,
      containerId: id,
      originalText: node.label
    });

    // todo: calculate the correct position of the label;
    labelNode.height = 26;

    if (isBrowser()) {
      const metrics = measureText(node.label, "20px sans-serif" as FontString);
      if (metrics.width != 0) {
        labelNode.width = metrics.width;
        labelNode.height = metrics.height;
      }
    }

    return labelNode;
  }

  private createBaseNode(node: Node) {
    return {
      id: node.id,
      type: 'rectangle',
      x: node.x,
      y: node.y,
      width: node.width || 0,
      height: node.height || 0,
      angle: 0,
      strokeColor: '#000000',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [],
      strokeSharpness: "sharp",
      seed: randomInteger(),
      version: 11,
      versionNonce: randomInteger(),
      isDeleted: false,
      boundElements: [],
      updated: Date.now(),
      link: null,
      locked: false,
    };
  }

  transpileEdge(edge: Edge) {
    const baseEdge = {
      id: edge.id,
      type: 'arrow',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      angle: 0,
      strokeColor: '#000000',
      backgroundColor: 'transparent',
      fillStyle: 'hachure',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 2,
      opacity: 100,
      groupIds: [],
      strokeSharpness: "round",
      seed: randomInteger(),
      version: 205,
      versionNonce: randomInteger(),
      isDeleted: false,
      boundElements: [],
      updated: Date.now(),
      link: null,
      locked: false,
      points: []
    } as any;

    const rPoints = this.reCalculateEdgePoints(edge);

    const sourceNode = this.createdNodeCaches.get(<string>edge.data?.source);
    if (edge.data?.source && sourceNode != undefined) {
      sourceNode.boundElements.push({
        id: edge.id,
        type: "arrow"
      });
    }

    const targetNode = this.createdNodeCaches.get(<string>edge.data?.target);
    if (edge.data?.target && targetNode != undefined) {
      targetNode.boundElements.push({
        id: edge.id,
        type: "arrow"
      });
    }

    // console.log(rPoints);
    Object.assign(baseEdge, {
      points: rPoints,
      lastCommittedPoint: null,
      startArrowhead: null,
      endArrowhead: "arrow"
    });

    // recalculate the points of the edge
    if (rPoints.length >= 2) {
      const startIntersects = this.pointByIntersectElement(baseEdge, sourceNode, 'start');
      const endIntersects = this.pointByIntersectElement(baseEdge, targetNode, 'end');

      Object.assign(baseEdge, {
        points: [startIntersects[0], endIntersects[0]],
        startBinding: {
          elementId: edge.data?.source,
          ...calculateFocusAndGap(baseEdge, sourceNode, "start")
        },

        endBinding: {
          elementId: edge.data?.target,
          ...calculateFocusAndGap(baseEdge, targetNode, "end")
        },
      })
    }


    Object.assign(baseEdge, {
      startBinding: {
        elementId: edge.data?.source,
        focus: 0,
        gap: 1
      },

      endBinding: {
        elementId: edge.data?.target,
        focus: 0,
        gap: 1
      },
    })

    return baseEdge
  }

  private pointByIntersectElement(baseEdge: any, sourceNode: any, startOrEnd: "start" | "end") {
    const direction = startOrEnd === "start" ? -1 : 1;
    const edgePointIndex = direction === -1 ? 0 : baseEdge.points.length - 1;
    const adjacentPointIndex = edgePointIndex - direction;
    const adjacentPoint = getPointAtIndexGlobalCoordinates(
      baseEdge,
      adjacentPointIndex,
    );

    const focusPointAbsolute = determineFocusPoint(
      baseEdge,
      0,
      adjacentPoint,
    );

    return intersectElementWithLine(
      sourceNode,
      adjacentPoint,
      focusPointAbsolute,
    );
  }

  private reCalculateEdgePoints(edge: Edge): [number, number][] {
    let rPoints: [number, number][] = [];
    const source: Node | undefined = this.createdNodeCaches.get(<string>edge.data?.source);
    const target: Node | undefined = this.createdNodeCaches.get(<string>edge.data?.target);
    if (source && target) {
      const start = {
        x: source.x! + source.width! / 2,
        y: source.y! + source.height! / 2,
      };
      const end = {
        x: target.x! + target.width! / 2,
        y: target.y! + target.height! / 2,
      };
      rPoints = [
        [start.x, start.y],
        [end.x, end.y]
      ];
    }

    return rPoints;
  }
}
