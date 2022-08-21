import { FeakinExporter } from '../exporter';
import { Edge, Graph, Node, NodeExt } from '../../model/graph';
import { randomInteger } from '../../renderer/drawn-style/rough-seed';
import { Point } from "../../model/geometry/point";
import { calculateFocusAndGap } from "./collision";

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
  nodeCaches: Map<string, any> = new Map<string, any>();

  constructor(graph: Graph) {
    this.graph = graph;
  }

  export(): ExportedDataState {
    const root = this.createRoot();

    this.graph.nodes.forEach(node => {
      const rectangle: any = this.createNode(node);
      this.nodeCaches.set(rectangle.id, rectangle);

      if (node.label) {
        root.elements.push(this.createLabel(node, rectangle.id));
      }
    });

    this.graph.edges.forEach(edge => {
      root.elements.push(this.createEdge(edge));
    });

    this.nodeCaches.forEach((node, _id) => {
      root.elements.push(node);
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

  createLabel(node: Node, id?: number): object {
    const labelNode = this.createBaseNode(node);
    labelNode.type = "text";
    Object.assign(labelNode, {
      id: node.id + randomInteger().toString(),
      text: node.label,
      fontSize: 12,
      fontFamily: 1,
      textAlign: "left",
      verticalAlign: "top",
      baseline: 12,
      containerId: id,
      originalText: node.label
    });

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
      versionNonce: 0,
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
      versionNonce: 0,
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    }

    const rPoints = this.reCalculateEdgePoints(edge);

    const sourceNode = this.nodeCaches.get(<string>edge.data?.source);
    if (edge.data?.source && sourceNode != undefined) {
      sourceNode.boundElements.push({
        id: edge.id,
        type: "arrow"
      });
    }

    const targetNode = this.nodeCaches.get(<string>edge.data?.target);
    if (edge.data?.source && targetNode != undefined) {
      targetNode.boundElements.push({
        id: edge.id,
        type: "arrow"
      });
    }

    Object.assign(baseEdge, {
      // todo: refs to excalidraw collision.ts for count focus and gap
      // startBinding: {
      //   elementId: edge.data?.source,
      //   focus: 0.05,
      //   gap: 1
      // },
      // endBinding: {
      //   elementId: edge.data?.target,
      //   focus: 0.05,
      //   gap: 1
      // },
      points: rPoints,
      lastCommittedPoint: null,
      startArrowhead: null,
      endArrowhead: "arrow"
    })

    Object.assign(baseEdge, {
      startBinding: {
        elementId: edge.data?.source,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...calculateFocusAndGap(baseEdge, sourceNode, "start")
      },

      endBinding: {
        targetElementId: edge.data?.target,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...calculateFocusAndGap(baseEdge, targetNode, "end")
      },
    })

    return baseEdge
  }

  private reCalculateEdgePoints(edge: Edge): [number, number][] {
    let rPoints: [number, number][] = [];
    const source: Node | undefined = this.nodeCaches.get(<string>edge.data?.source);
    const target: Node | undefined = this.nodeCaches.get(<string>edge.data?.target);
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
