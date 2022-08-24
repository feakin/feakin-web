import { MXCell, MxFileRoot, MxGraph, MxPoint } from "./mxgraph";
import DrawioEncode from "./encode/drawio-encode";
import { js2xml } from "./encode/xml-converter";
import { Edge, Graph, Node } from "../../model/graph";
import { Exporter, Transpiler } from "../exporter";

export class DrawioExporter extends Exporter<MxFileRoot> implements Transpiler {
  idIndex = 0;
  GUID_LENGTH = 20;
  GUID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

  constructor(graph: Graph) {
    super(graph);
    this.graph = graph;
  }

  guid(length?: number): string {
    const len = (length != null) ? length : this.GUID_LENGTH;
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
    let cells = [
      {
        attributes: {
          id: "0",
        }
      },
      {
        attributes: {
          id: "1",
          parent: "0"
        }
      }] as MXCell[];

    cells = cells.concat(this.graph.nodes.map(node => this.transpileNode(node)));
    cells = cells.concat(this.graph.edges.map(edge => this.transpileEdge(edge)));

    const mxGraph = this.wrapperGraph(cells);
    return this.wrapperRoot(mxGraph);
  }

  // calculate for new position ??
  transpileEdge(edge: Edge): MXCell {
    const points = edge.points.map(point => {
      return {
        attributes: {
          x: point.x.toString(),
          y: point.y.toString(),
          'as': 'point'
        }
      }
    });

    if (points.length >= 2) {
      points[0].attributes.as = 'sourcePoint';
      points[1].attributes.as = 'sourcePoint';
    }

    return {
      attributes: {
        id: this.id(),
        style: "rounded=0;whiteSpace=wrap;html=1;",
        edge: "1",
        parent: "1",
      },
      mxGeometry: {
        mxPoint: points,
        attributes: {
          relative: "1",
          as: "geometry",
        }
      }
    };
  }

  transpileNode(node: Node): MXCell {
    return {
      attributes: {
        id: this.id(),
        style: "rounded=0;whiteSpace=wrap;html=1;",
        value: node.label,
        vertex: "1",
        parent: "1"
      },
      mxGeometry: {
        attributes: {
          as: "geometry",
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height
        }
      }
    };
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

