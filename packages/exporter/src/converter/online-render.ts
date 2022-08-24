import { deflate, inflate } from "pako";
import { fromUint8Array, toUint8Array } from "js-base64";
import { TextEncoder } from "util";

import { SupportedTarget } from "./converter";
import { Graph } from "../model/graph";

export interface MermaidOnlineState {
  code: string;
  mermaid: string;
  updateEditor: boolean;
  updateDiagram: boolean;
  autoSync: boolean;
  panZoom?: boolean;
  pan?: { x: number; y: number };
  zoom?: number;
  loader?: any;
}

export class OnlineRender {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  render(target: SupportedTarget): URL {
    let url: URL;
    switch (target) {
      case SupportedTarget.MERMAID:
        url = OnlineRender.buildMermaidUrl("");
        break;
      case SupportedTarget.DOT:
        url = OnlineRender.buildDotUrl("");
        break;
      default:
        throw new Error("Unsupported target");
    }

    return url;
  }

  static pakoDeSerde(content: string): string {
    const data = toUint8Array(content);
    return inflate(data, { to: 'string' });
  }

  static pakoSerde(content: string): string {
    const textEncoder = this.getDecoder();
    const data = textEncoder.encode(content);
    const compressed = deflate(data, { level: 9 });
    return fromUint8Array(compressed, true);
  }

  private static getDecoder() {
    return TextEncoder ? new TextEncoder() : new window.TextEncoder();
  }

  static buildMermaidUrl(content: string): URL {
    const baseUrl = "https://mermaid.live/edit#";
    const config: MermaidOnlineState = {
      "code": content,
      "mermaid": "{\n  \"theme\": \"default\"\n}",
      "updateEditor": false,
      "autoSync": true,
      "updateDiagram": false
    }

    return new URL(baseUrl + "pako:" + this.pakoSerde(JSON.stringify(config)));
  }

  // Graphviz official use playground, like in: [https://graphviz.org/doc/info/attrs.html](https://graphviz.org/doc/info/attrs.html)
  static buildDotUrl(content: string): URL {
    const baseUrl = "http://magjac.com/graphviz-visual-editor/?dot=";
    return new URL(baseUrl + encodeURI(content));
  }

  // old
  static buildDotUrl2(content: string): URL {
    const baseUrl = "https://dreampuf.github.io/GraphvizOnline/#";
    return new URL(baseUrl + encodeURI(content));
  }
}
