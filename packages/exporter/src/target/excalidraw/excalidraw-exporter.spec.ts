import * as fs from "fs";
import DrawioEncode from "../mxgraph/drawio-encode";
import { Mxfile, MxGraph } from "../mxgraph/mxgraph";
import { DrawioConverter } from "../mxgraph/drawio-converter";
import { ExcalidrawExporter } from "./excalidraw-exporter";
import { Graph } from "../../model/graph";

function fromFile(path: string): DrawioConverter {
  const data = fs.readFileSync(path, 'utf8');

  const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
  const mxGraph = DrawioEncode.xml2obj(encoded) as MxGraph;

  return new DrawioConverter(mxGraph);
}

describe('ExcalidrawExporter', () => {
  let mxGraph: MxGraph;

  const drawioConverter = fromFile('_fixtures/drawio/source-target.drawio');
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
    const arrow = arrows[0];
    expect(arrow.id).toEqual('V2nca5gEMj-imVLVonEm-3');
    expect(arrow.startBinding).toBeDefined();
    expect(arrow.endBinding).toBeDefined();
    fs.writeFileSync('./test/source-target.excalidraw', JSON.stringify(exporter, null, 2));
  });

  it('source startBinding', () => {
    const exporter = new ExcalidrawExporter(sourceTargetGraph).export();

    const arrows = exporter.elements.filter(e => e.type === 'arrow');
    const arrow = arrows[0];

    expect(arrow.points).toEqual([[290, 370], [290, 450]]);
    expect(arrow.startBinding).toEqual({
      "elementId": "V2nca5gEMj-imVLVonEm-1",
      "focus": 0,
      "gap": 1
    });
    expect(arrow.endBinding).toEqual({
      "elementId": "V2nca5gEMj-imVLVonEm-2",
      "focus": 0,
      "gap": 1
    });
  });

  it('curved', () => {
    const drawioConverter = fromFile('_fixtures/drawio/source-target-curved.drawio');
    const sourceTargetGraph: Graph = drawioConverter.convert();

    const exporter = new ExcalidrawExporter(sourceTargetGraph).export();

    const nodes = exporter.elements.filter(e => e.type === 'rectangle');
    expect(nodes.length).toEqual(3);

    fs.writeFileSync('./test/source-target-curved.excalidraw', JSON.stringify(exporter, null, 2));
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
