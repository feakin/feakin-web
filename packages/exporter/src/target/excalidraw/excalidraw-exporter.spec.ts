import * as fs from "fs";
import DrawioEncode from "../mxgraph/drawio-encode";
import { Mxfile, MxGraph } from "../mxgraph/mxgraph";
import { DrawioConverter } from "../mxgraph/drawio-converter";
import { ExcalidrawExporter } from "./excalidraw-exporter";
import { Graph } from "../../model/graph";

describe('ExcalidrawExporter', () => {
  let mxGraph: MxGraph;

  const drawioConverter = DrawioConverter.fromFile('_fixtures/drawio/source-target.drawio');
  const sourceTargetGraph: Graph = drawioConverter.convert();

  beforeAll(() => {
    const data = fs.readFileSync('_fixtures/drawio/android-ag.drawio', 'utf8');

    const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
    mxGraph = DrawioEncode.xml2obj(encoded) as MxGraph;


    if (!fs.existsSync("test")) {
      fs.mkdirSync('test');
    }
  });

  it('source and target', () => {
    const exporter = new ExcalidrawExporter(sourceTargetGraph).export();

    expect(exporter).toBeDefined();
    expect(exporter.elements.length).toBe(5);

    const arrows = exporter.elements.filter(e => e.type === 'arrow');
    expect(arrows[0].startBinding).toBeDefined();
    expect(arrows[0].endBinding).toBeDefined();
    fs.writeFileSync('./test/source-target.excalidraw', JSON.stringify(exporter, null, 2));
  });

  it('text id', () => {
    const exporter = new ExcalidrawExporter(sourceTargetGraph).export();

    const textElements = exporter.elements.filter(e => e.type === 'text');
    expect(textElements[0].text).toEqual('A');
  });

  it('exporter', () => {
    const drawioConverter = new DrawioConverter(mxGraph);
    const graph: Graph = drawioConverter.convert();

    const exporter = new ExcalidrawExporter(graph).export();

    fs.writeFileSync('./test/exporter.excalidraw', JSON.stringify(exporter, null, 2));
  });
});
