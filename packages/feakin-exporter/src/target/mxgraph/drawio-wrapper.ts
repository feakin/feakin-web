import { MXCell, MxFileRoot, MxGraph } from "./mxgraph";
import MxGraphEncode from "./mxgraph-encode";
import { js2xml } from "./xml-converter";
import { BaseNode } from "../../layout/dagre-layout";

export class DrawIoWrapper {
  fromNodes(nodes: BaseNode[]): MXCell[] {
    return nodes.map(node => {
      return {
        attributes: {
          // todo: generate ids
          id: "",
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
  const cells: MXCell[] = [
    {
      attributes: {
        id: "0",
      }
    },
    {
      attributes: {
        id: "ARSg04o7xmWB_3SNBJeL-0",
        vertex: 1,
        style: "rounded=0;whiteSpace=wrap;html=1;",
        value: "Hello, world!",
        parent: "0",
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

  const wrapper = new DrawIoWrapper();
  const mxGraph = wrapper.wrapperGraph(cells);
  return wrapper.toXml(wrapper.wrapperRoot(mxGraph));
}
