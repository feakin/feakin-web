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
      root.elements.push(this.createNode(node));
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
      "type": "excalidraw",
      "version": 2,
      "source": "https://feakin.com",
      "elements": [],
      "appState": {
        "gridSize": null,
        "viewBackgroundColor": "#ffffff"
      },
      "files": {}
    }
  }

  createNode(node: Node): object {
    return {
      id: randomInteger(),
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
