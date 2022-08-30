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
import { groupPoints } from "../../model/geometry/point";
import { nanoid } from "nanoid";
import { TriangleShape } from "../../model/node/triangle-shape";

export interface ExportedDataState {
  type: string;
  version: number;
  source: string;
  elements: any[];
  appState: any;
  files: any;
}

export type ExNode = any;

export class ExcalidrawExporter extends Exporter<ExportedDataState> implements Transpiler {
  originNodeCaches: Map<string, Node> = new Map<string, Node>();
  createdNodeCaches: Map<string, ExNode> = new Map<string, any>();

  constructor(graph: Graph) {
    super(graph);
    this.graph = graph;
  }

  override intermediate(): ExportedDataState {
    const root = this.createRoot();

    this.graph.nodes.forEach(node => {
      const rectangle: ExNode = this.transpileNode(node);
      this.originNodeCaches.set(<string>node.id, node);
      this.createdNodeCaches.set(rectangle.id, rectangle);
    });

    this.createdNodeCaches.forEach((node) => {
      const newNode = node;
      const originNode: Node | undefined = this.originNodeCaches.get(<string>node.id);
      if (originNode?.label) {
        this.createLabel(originNode, newNode, root);
      }

      root.elements.push(node);
    });

    this.graph.edges.forEach(edge => {
      const maybeValidEdge = this.transpileEdge(edge);
      if (maybeValidEdge !== null) {
        root.elements.push(maybeValidEdge);
      }
    });

    return root;
  }

  private createLabel(originNode: Node, newNode: ExNode, root: ExportedDataState) {
    const label = this.transpileLabel(originNode, newNode.id);
    root.elements.push(label);

    if (!this.isUnsupportedPolygon(originNode)) {
      newNode.boundElements.push({
        id: label.id,
        type: "text"
      })
    }
  }

  override export(): string {
    return JSON.stringify(this.intermediate(), null, 2);
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

  transpileNode(node: Node): ExNode {
    const baseNode: any = this.createBaseNode(node);
    if (this.isUnsupportedPolygon(node)) {
      switch (node.data?.shape) {
        case "triangle":
          // Node to Edge
          // eslint-disable-next-line no-case-declarations
          const points = groupPoints(new TriangleShape(node.x, node.y, node.width, node.height).points()) as any;
          this.NodeToPolylineShape(baseNode, node, points);
          break;
      }
    }

    return baseNode;
  }

  /**
   * in Excalidraw, a polygon is a polyline with a start and end point
   */
  private isUnsupportedPolygon(node: Node) {
    return node.data?.shape === "triangle";
  }

  private NodeToPolylineShape(baseNode: any, node: Node, points: number[][]) {
    Object.assign(baseNode, {
      type: "line",
      points: points,
      lastCommittedPoint: null,
      startBinding: null,
      endBinding: null,
      startArrowhead: null,
      endArrowhead: null
    })
  }

  transpileLabel(node: Node, id?: number): any {
    const labelNode = this.createBaseNode(node);
    labelNode.type = "text";

    Object.assign(labelNode, {
      id: nanoid(),
      x: node.x || 0,
      y: node.y || 0,
      width: node.width || 0,
      height: node.height || 0,
      text: node.label,
      fontSize: 20,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      baseline: 18,
      containerId: this.isUnsupportedPolygon(node) ? null : id,
      originalText: node.label
    });

    labelNode.height = 26;

    if (isBrowser()) {
      // todo: resize the parent container to fit the label
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
      type: node.data?.shape || "rectangle",
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
      version: 1,
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
    const targetNode = this.createdNodeCaches.get(<string>edge.data?.target);

    const isCustomShape = sourceNode && targetNode && (sourceNode.type == "line" || targetNode.type == "line");
    if (isCustomShape) {
      Object.assign(baseEdge, {
        points: groupPoints(edge.points),
        lastCommittedPoint: null,
        startArrowhead: null,
        startBinding: null,
        endBinding: null,
        endArrowhead: "arrow"
      });

      return baseEdge;
    }

    if (edge.data?.source && sourceNode != undefined) {
      sourceNode.boundElements.push({
        id: edge.id,
        type: "arrow"
      });
    }

    if (edge.data?.target && targetNode != undefined) {
      targetNode.boundElements.push({
        id: edge.id,
        type: "arrow"
      });
    }


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
