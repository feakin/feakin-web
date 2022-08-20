import { FeakinExporter } from './exporter';
import { Graph, Node } from '../model/graph';
import { randomInteger } from '../renderer/drawn-style/rough-seed';

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

  constructor(graph: Graph) {
    this.graph = graph;
  }

  export(): ExportedDataState {
    const root = this.createRoot();

    this.graph.nodes.forEach(node => {
      const rectangle: any = this.createNode(node);
      root.elements.push(rectangle);
      if (node.label) {
        root.elements.push(this.createLabel(node, rectangle.id));
      }
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
      text: node.label,
      fontSize: 20,
      fontFamily: 3,
      textAlign: "left",
      verticalAlign: "top",
      baseline: 18,
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
}
