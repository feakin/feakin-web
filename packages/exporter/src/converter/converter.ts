import { Graph } from "../model/graph";
import { Importer } from "./importer";

import { ExcalidrawImporter } from "./excalidraw/excalidraw-importer";
import { DrawioImporter } from "./drawio/drawio-importer";
import { MermaidImporter } from "./mermaid/mermaid-importer";
import { DrawioExporter } from "./drawio/drawio-exporter";
import { ExcalidrawExporter } from "./excalidraw/excalidraw-exporter";
import { Exporter } from "./exporter";
import { DotExporter } from "./dot/dot-exporter";
import { MermaidExporter } from "./mermaid/mermaid-exporter";
import { DotWasmImporter } from "./dot/dot-wasm-importer";

export enum SupportedFileType {
  EXCALIDRAW = "excalidraw",
  DRAWIO = "drawio",
  MERMAID = "mermaid",
  GRAPHVIZ = "graphviz",
  Feakin = "feakin",
}

export enum SupportedTarget {
  EXCALIDRAW = "excalidraw",
  DRAWIO = "drawio",
  MERMAID = "mermaid",
  DOT = "dot"
}

/**
 * Import a graph to a string representation of the graph, and export a string representation of the graph to a graph.
 */
export class Converter {
  get graph(): Graph {
    return this._graph;
  }

  private readonly _graph: Graph;

  constructor(graph: Graph) {
    this._graph = graph;
  }

  /**
   * Create an importer from a file extension.
   * @param content
   * @param fileExt
   * @param isBrowser
   * @returns {Graph}
   */
  static fromContent(content: string, fileExt: string, isBrowser = false): Promise<Converter> {
    const parser = this.createFrom(fileExt, content, isBrowser);
    if (parser.isPromise) {
      return parser.parsePromise().then((graph) => {
        return Promise.resolve(new Converter(graph))
      });
    } else {
      const graph = parser.parse();
      const converter = new Converter(graph);

      return Promise.resolve(converter);
    }
  }

  /**
   * Create an exporter from a file extension.
   * @param fileExt
   * @param content
   * @param isBrowser
   * @returns {Importer}
   */
  static createFrom(fileExt: string, content: string, isBrowser = false): Importer {
    let parser: Importer;
    switch (fileExt) {
      case SupportedFileType.EXCALIDRAW:
        parser = new ExcalidrawImporter(content);
        break;
      case SupportedFileType.DRAWIO:
        parser = new DrawioImporter(content, isBrowser);
        break;
      case SupportedFileType.MERMAID:
        parser = new MermaidImporter(content);
        break;
      case SupportedFileType.GRAPHVIZ:
        parser = new DotWasmImporter(content);
        break;
      case SupportedFileType.Feakin:
        parser = new DotWasmImporter(content);
        break;
      default:
        throw new Error("Unsupported file type: " + fileExt);
    }

    return parser;
  }

  target(target: string): string {
    console.log(target)
    let exporter: Exporter<any>;
    switch (target) {
      case SupportedTarget.EXCALIDRAW:
        exporter = new ExcalidrawExporter(this._graph);
        break;
      case SupportedTarget.DRAWIO:
        exporter = new DrawioExporter(this._graph);
        break;
      case SupportedTarget.MERMAID:
        exporter = new MermaidExporter(this._graph);
        break;
      case SupportedTarget.DOT:
        exporter = new DotExporter(this._graph);
        break;
      default:
        throw new Error("Unsupported file type");
    }

    return exporter.export();
  }
}
