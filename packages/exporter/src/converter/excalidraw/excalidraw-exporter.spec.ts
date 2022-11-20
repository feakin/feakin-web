import * as fs from "fs";
import DrawioEncode from "../drawio/encode/drawio-encode";
import { Mxfile, MxGraph } from "../drawio/mxgraph";
import { DrawioImporter } from "../drawio/drawio-importer";
import { ExcalidrawExporter } from "./excalidraw-exporter";
import { Graph } from "../../model/graph";

function fromFile(path: string): DrawioImporter {
  return new DrawioImporter(fs.readFileSync(path, 'utf8'));
}

describe('ExcalidrawExporter', () => {
  let mxGraph: MxGraph;
  let data: string;

  const drawioConverter = fromFile('_fixtures/drawio/source-target.drawio');
  const sourceTargetGraph: Graph = drawioConverter.parse();

  beforeAll(() => {
    data = fs.readFileSync('_fixtures/drawio/android-ag.drawio', 'utf8');

    const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
    mxGraph = DrawioEncode.xml2obj(encoded) as MxGraph;

    if (!fs.existsSync("test")) {
      fs.mkdirSync('test');
    }
  });

  it('source and target', () => {
    const exporter = new ExcalidrawExporter(sourceTargetGraph).intermediate();

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
    const exporter = new ExcalidrawExporter(sourceTargetGraph).intermediate();

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
    const sourceTargetGraph: Graph = drawioConverter.parse();

    const exporter = new ExcalidrawExporter(sourceTargetGraph).intermediate();

    const nodes = exporter.elements.filter(e => e.type === 'rectangle');
    expect(nodes.length).toEqual(3);

    fs.writeFileSync('./test/source-target-curved.excalidraw', JSON.stringify(exporter, null, 2));
  });

  it('fix rect not correct issue', () => {
    const drawioConverter = fromFile('_fixtures/drawio/functional.drawio');
    const sourceTargetGraph: Graph = drawioConverter.parse();

    const exporter = new ExcalidrawExporter(sourceTargetGraph).intermediate();

    expect(exporter.elements.length).toEqual(152);

    fs.writeFileSync('./test/functional.excalidraw', JSON.stringify(exporter, null, 2));
  });

  it('text id', () => {
    const exporter = new ExcalidrawExporter(sourceTargetGraph).intermediate();

    const textElements = exporter.elements.filter(e => e.type === 'text');
    expect(textElements[0].text).toEqual('A');
  });

  it('exporter', () => {
    const drawioConverter = new DrawioImporter(data);
    const graph: Graph = drawioConverter.parse();

    const exporter = new ExcalidrawExporter(graph).export();

    fs.writeFileSync('./test/exporter.excalidraw', JSON.stringify(exporter, null, 2));
  });
});
