import { MXCell, MxFileRoot, MxGraph } from "./mxgraph";
import MxGraphEncode from "./mxgraph-encode";
import { js2xml } from "./xml-converter";
import { Node } from "../../model/graph";

export class DrawIoWrapper {
  idIndex = 0;
  GUID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

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

  fromNodes(nodes: Node[]): MXCell[] {
    return nodes.map(node => {
      return {
        attributes: {
          id: this.id(),
          style: "rounded=0;whiteSpace=wrap;html=1;",
          value: node.label
        },
        mxGeometry: {
          attributes: {
            as: "geometry",
            width: 100,
            height: 60
          }
        }
      };
    });
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
          _text: MxGraphEncode.encode(js2xml(graph))
        }
      }
    };
  }

  toXml(file: MxFileRoot): string {
    return js2xml(file)
  }
}

export function wrapperToDrawIo() {
  const wrapper = new DrawIoWrapper();

  const cells: MXCell[] = [
    {
      attributes: {
        id: "0",
      }
    },
    {
      attributes: {
        id: `${ wrapper.id() }`,
        vertex: 1,
        style: "rounded=0;whiteSpace=wrap;html=1;",
        value: "Hello, world!",
        parent: "0"
      },
      mxGeometry: {
        attributes: {
          as: "geometry",
          width: 100,
          height: 60
        }
      }
    }
  ];

  const mxGraph = wrapper.wrapperGraph(cells);
  return wrapper.toXml(wrapper.wrapperRoot(mxGraph));
}
