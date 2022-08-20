import * as fs from "fs";
import DrawioEncode from "../mxgraph/drawio-encode";
import { Mxfile, MxGraph } from "../mxgraph/mxgraph";
import { DrawioConverter } from "../mxgraph/drawio-converter";
import { ExcalidrawExporter } from "./excalidraw-exporter";
import { Graph } from "../../model/graph";

describe('ExcalidrawExporter', () => {
  let mxGraph: MxGraph;

  beforeAll(() => {
    const data = fs.readFileSync('_fixtures/drawio/android-ag.drawio', 'utf8');

    const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
    mxGraph = DrawioEncode.xml2obj(encoded) as MxGraph;

    if (!fs.existsSync("test")) {
      fs.mkdirSync('test');
    }
  });

  it('exporter', () => {
    const drawioConverter = new DrawioConverter(mxGraph);
    const graph: Graph = drawioConverter.convert();

    const exporter = new ExcalidrawExporter(graph).export();

    fs.writeFileSync('./test/exporter.excalidraw', JSON.stringify(exporter, null, 2));
  });
});
