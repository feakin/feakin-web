import { Graph } from "../model/graph";
import { Importer } from "./importer";
import { ExcalidrawImporter } from "./excalidraw/excalidraw-importer";
import { Exporter } from "./exporter";

const enum SupportedFileType {
  EXCALIDRAW = "excalidraw",
  DRAWIO = "drawio",
  MERMAID = "mermaid",
  DOT = "dot",
}

export class DrawioImporterS extends Importer {
  constructor(content: string) {
    super(content);
  }
}

export class MermaidImporter extends Importer {
  constructor(content: string) {
    super(content);
  }
}

export class DotImporter extends Importer {
  constructor(content: string) {
    super(content);
  }
}


/**
 * ExcalidrawExporter
 */
export class Converter {
  protected graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  fromContent(content: string, fileExt: string) : Graph {
    switch (fileExt) {
      case SupportedFileType.EXCALIDRAW:
        return new ExcalidrawImporter(content).parse();
      case SupportedFileType.DRAWIO:
        return new DrawioImporterS(content).parse();
      case SupportedFileType.MERMAID:
        return new MermaidImporter(content).parse();
      case SupportedFileType.DOT:
        return new DotImporter(content).parse();
      default:
        throw new Error("Unsupported file type");
    }
  }

  fromGraph(graph: Graph) {
    return new Converter(graph);
  }

  target(exporter: Exporter<any>): string {
    return exporter.export(this.graph);
  }
}
