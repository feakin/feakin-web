import { MXCell, MxFileRoot, MxGraph } from "./mxgraph";
import DrawioEncode from "./encode/drawio-encode";
import { js2xml } from "./encode/xml-converter";
import { Edge, ElementProperty, Graph, Node } from "../../model/graph";
import { Exporter, Transpiler } from "../exporter";

export class DrawioExporter extends Exporter<MxFileRoot> implements Transpiler {
  idIndex = 0;
  GUID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

  constructor(graph: Graph) {
    super(graph);
    this.graph = graph;
  }

  guid(): string {
    const len = (length != null) ? length : this.GUID_ALPHABET;
    const rtn = [];

    for (let i = 0; i < len; i++) {
      rtn.push(this.GUID_ALPHABET.charAt(Math.floor(Math.random() * this.GUID_ALPHABET.length)));
    }

    return rtn.join('');
  }

  id(): string {
    this.idIndex++;
    return `${ this.guid() }-${ this.idIndex }`;
  }

  override export(): MxFileRoot {
    const cells = this.graph.nodes.map(this.transpileNode.bind(this));

    const mxGraph = this.wrapperGraph(cells);
    return this.wrapperRoot(mxGraph);
  }

  transpileEdge(edge: Edge): MXCell {
    return {} as MXCell;
  }

  transpileLabel(node: Node, ...args: any[]): MXCell {
    return {} as MXCell;
  }

  transpileNode(node: Node): MXCell {
    return {
      attributes: {
        id: this.id(),
        style: "rounded=0;whiteSpace=wrap;html=1;",
        value: node.label
      },
      mxGeometry: {
        attributes: {
          as: "geometry",
          width: node.width,
          height: node.height
        }
      }
    };
  }

  transpileStyle(prop: ElementProperty): any {
    return "";
  }

  wrapperGraph(mxCells: MXCell[]): MxGraph {
    return {
      mxGraphModel: {
        root: {
          mxCell: mxCells
        }
      }
    };
  }

  wrapperRoot(graph: MxGraph): MxFileRoot {
    return {
      mxfile: {
        diagram: {
          _text: DrawioEncode.encode(js2xml(graph))
        }
      }
    };
  }

  static toXml(file: MxFileRoot): string {
    return js2xml(file)
  }
}

