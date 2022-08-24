import { Graph } from "../model/graph";
import { Importer } from "./importer";

import { ExcalidrawImporter } from "./excalidraw/excalidraw-importer";
import { DrawioImporter } from "./drawio/drawio-importer";
import { MermaidImporter } from "./mermaid/mermaid-importer";
import { DrawioExporter } from "./drawio/drawio-exporter";
import { ExcalidrawExporter } from "./excalidraw/excalidraw-exporter";

import { DotImporter } from "./dot/dot-importer";
import { Exporter } from "./exporter";
import { DotExporter } from "./dot/dot-exporter";

export enum SupportedFileType {
  EXCALIDRAW = "excalidraw",
  DRAWIO = "drawio",
  MERMAID = "mermaid",
  DOT = "dot",
}

export enum SupportedTarget {
  EXCALIDRAW = "excalidraw",
  DRAWIO = "drawio",
  DOT = "dot"
}

/**
 * Import a graph to a string representation of the graph, and export a string representation of the graph to a graph.
 */
export class Converter {
  protected graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  /**
   * Create an importer from a file extension.
   * @param content
   * @param fileExt
   * @returns {Graph}
   */
  static fromContent(content: string, fileExt: string): Converter {
    const parser = this.createFrom(fileExt, content);
    const graph = parser.parse();
    return this.fromGraph(graph);
  }

  static fromGraph(graph: Graph) {
    return new Converter(graph);
  }

  /**
   * Create an exporter from a file extension.
   * @param fileExt
   * @param content
   * @returns {Importer}
   */
  static createFrom(fileExt: string, content: string): Importer {
    let parser: Importer;
    switch (fileExt) {
      case SupportedFileType.EXCALIDRAW:
        parser = new ExcalidrawImporter(content);
        break;
      case SupportedFileType.DRAWIO:
        parser = new DrawioImporter(content);
        break;
      case SupportedFileType.MERMAID:
        parser = new MermaidImporter(content);
        break;
      case SupportedFileType.DOT:
        parser = new DotImporter(content);
        break;
      default:
        throw new Error("Unsupported file type");
    }

    return parser;
  }

  target(target: string): string {
    let exporter: Exporter<any>;
    switch (target) {
      case SupportedTarget.EXCALIDRAW:
        exporter = new ExcalidrawExporter(this.graph);
        break;
      case SupportedTarget.DRAWIO:
        exporter = new DrawioExporter(this.graph);
        break;
      case SupportedTarget.DOT:
        exporter = new DotExporter(this.graph);
        break;
      default:
        throw new Error("Unsupported file type");
    }

    return exporter.export();
  }
}
