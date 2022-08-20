import * as fs from "fs";
import * as path from "path";
import DrawioEncode from "./mxgraph/drawio-encode";
import { Mxfile, MxGraph } from "./mxgraph/mxgraph";
import { DrawioConverter } from "./mxgraph/drawio-converter";
import { ExcalidrawExporter } from "./excalidraw-exporter";
import { Graph } from "../model/graph";

const pwd = process.env["PWD"] || process.cwd();

describe('ExcalidrawExporter', () => {
  let mxGraph: MxGraph;

  beforeAll(() => {
    const drawioFile = path.resolve(pwd, "./_fixtures/drawio/android-ag.drawio");
    const data = fs.readFileSync(drawioFile, { encoding: 'utf8', flag: 'r' });

    const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
    mxGraph = DrawioEncode.xml2obj(encoded) as MxGraph;
  });

  it('exporter', () => {
    const drawioConverter = new DrawioConverter(mxGraph);
    const graph: Graph = drawioConverter.convert();

    const exporter = new ExcalidrawExporter(graph).export();

    fs.writeFileSync('./test/exporter.excalidraw', JSON.stringify(exporter, null, 2));
  });
});
