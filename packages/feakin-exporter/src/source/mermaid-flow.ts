import { FlowDb } from "./mermaid-flowdb";

const Converter = require("@feakin/converter");


export function flow(str: string) {
  let flowParser = Converter.flowParser();
  let flowDb = new FlowDb();

  flowParser.parser.yy = {
    setDirection: flowDb.setDirection.bind(flowDb),
    addVertex: flowDb.addVertex.bind(flowDb),
    addLink: flowDb.addLink.bind(flowDb),
    destructLink: flowDb.destructLink.bind(flowDb),
    lex: {
      firstGraph: () => {
        return true;
      }
    }
  };

  flowParser.parser.yy.graphType = "flowchart";
  flowParser.parse(str)

  return {
    direction: flowDb.direction,
    vertices: flowDb.vertices,
    edges: flowDb.edges,
  };
}
