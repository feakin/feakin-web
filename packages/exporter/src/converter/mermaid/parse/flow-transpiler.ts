// eslint-disable-next-line @typescript-eslint/no-var-requires
const Converter = require("@feakin/parser");
import { FlowDb } from "./mermaid-flowdb";

const emptyFunc = (args: any) => {
  //
};

export function flowTranspiler(str: string) {
  const flowParser = Converter.flowParser();
  const flowDb = new FlowDb();

  flowParser.parser.yy = {
    setTooltip: emptyFunc,
    setClickEvent: emptyFunc,
    setLink: emptyFunc,
    setDirection: flowDb.setDirection.bind(flowDb),
    addVertex: flowDb.addVertex.bind(flowDb),
    addLink: flowDb.addLink.bind(flowDb),
    destructLink: flowDb.destructLink.bind(flowDb),
    addSubGraph: flowDb.addSubGraph.bind(flowDb),
    lex: {
      firstGraph: flowDb.firstGraph.bind(flowDb)
    }
  };

  flowParser.parser.yy.graphType = "flowchart";
  flowParser.parse(str)

  return {
    direction: flowDb.getDirection(),
    nodes: flowDb.vertices,
    edges: flowDb.edges,
    subGraphs: flowDb.getSubGraphs()
  };
}
