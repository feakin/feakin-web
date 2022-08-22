import { FeakinExporter } from '../exporter';
import { Edge, Graph, Node, NodeExt } from '../../model/graph';
import { randomInteger } from '../../renderer/drawn-style/rough-seed';
import {
  calculateFocusAndGap, determineFocusPoint, getPointAtIndexGlobalCoordinates,
  intersectElementWithLine,
} from "./collision";
import { FontString, measureText } from "./text-utils";
import { ExPoint } from "./excalidraw-types";
import { getCommonBounds, getElementBounds } from "./bounds";

export interface ExportedDataState {
  type: string;
  version: number;
  source: string;
  elements: any[];
  appState: any;
  files: any;
}

export class ExcalidrawExporter implements FeakinExporter {
  graph: Graph;
  originNodeCaches: Map<string, Node> = new Map<string, Node>();
  createdNodeCaches: Map<string, any> = new Map<string, any>();

  constructor(graph: Graph) {
    this.graph = graph;
  }

  export(): ExportedDataState {
    const root = this.createRoot();

    this.graph.nodes.forEach(node => {
      const rectangle: any = this.createNode(node);
      this.originNodeCaches.set(<string>node.id, node);
      this.createdNodeCaches.set(rectangle.id, rectangle);
    });

    this.createdNodeCaches.forEach((node, _id) => {
      const newNode = node;
      const originNode = this.originNodeCaches.get(<string>node.id);
      if (originNode?.label) {
        const label = this.createLabel(originNode, node.id);
        root.elements.push(label);
        newNode.boundElements.push({
          id: label.id!,
          type: "text"
        })
      }

      root.elements.push(node);
    });

    this.graph.edges.forEach(edge => {
      root.elements.push(this.createEdge(edge));
    });

    return root;
  }

  footer(): string {
    return '';
  }

  header(): string {
    return '';
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

  createNode(node: Node): object {
    return this.createBaseNode(node);
  }

  createLabel(node: Node, id?: number): any {
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

    const metrics = measureText(node.label!, "20px sans-serif" as FontString);
    if (metrics.width != 0) {
      labelNode.width = metrics.width;
      labelNode.height = metrics.height;
    } else {
      labelNode.height = 26;
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

  private createEdge(edge: Edge) {
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

    Object.assign(baseEdge, {
      points: rPoints,
    });

    const startIntersects = this.pointByIntersectElement(baseEdge, sourceNode, 'start');
    const endIntersects = this.pointByIntersectElement(baseEdge, targetNode, 'end');

    Object.assign(baseEdge, {
      points: [startIntersects[0], endIntersects[0]],
      lastCommittedPoint: null,
      startArrowhead: null,
      endArrowhead: "arrow"
    })

    Object.assign(baseEdge, {
      startBinding: {
        elementId: edge.data?.source,
        ...calculateFocusAndGap(baseEdge, sourceNode, "start")
      },

      endBinding: {
        elementId: edge.data?.target,
        ...calculateFocusAndGap(baseEdge, targetNode, "end")
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

    const intersections = intersectElementWithLine(
      sourceNode,
      adjacentPoint,
      focusPointAbsolute,
    );

    return intersections;
  }

  private reCalculateEdgePoints(edge: Edge): [number, number][] {
    let rPoints: [number, number][] = [];
    const source: Node | undefined = this.createdNodeCaches.get(<string>edge.data?.source);
    const target: Node | undefined = this.createdNodeCaches.get(<string>edge.data?.target);
    if (source && target) {
      const start = NodeExt.getCenter(source);
      const end = NodeExt.getCenter(target);
      rPoints = [
        [start.x, start.y],
        [end.x, end.y]
      ];
    }

    return rPoints;
  }
}
