import DrawioEncode from './drawio-encode';
import { MXCell, Mxfile, MxGraph } from './mxgraph';
import * as fs from "fs";
import * as path from "path";
import { DrawioConverter } from "./drawio-converter";
import { Graph } from "../../model/graph";

const pwd = process.env["PWD"] || process.cwd();

describe('DrawioEncoder', () => {
  let cells: MXCell[] = [];
  let mxGraph: MxGraph;

  beforeAll(() => {
    const drawioFile = path.resolve(pwd, "./_fixtures/drawio/android-ag.drawio");
    const data = fs.readFileSync(drawioFile, { encoding: 'utf8', flag: 'r' });

    const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
    mxGraph = DrawioEncode.xml2obj(encoded) as MxGraph;

    cells = mxGraph.mxGraphModel.root.mxCell;
  });

  it('decode for relations', () => {
    expect(cells.length).toBe(62);
  });

  it('parse style', () => {
    const drawioConverter = new DrawioConverter(mxGraph);
    const parseStyle = drawioConverter.parseStyle("endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=1;entryY=0;entryDx=0;entryDy=0;curved=1;");
    expect(parseStyle["curved"]).toBeTruthy();
  });

  it('filter node', () => {
    const drawioConverter = new DrawioConverter(mxGraph);
    const graph: Graph = drawioConverter.convert();

    expect(graph.props?.height).toBe(1100);
    expect(graph.props?.width).toBe(850);

    const nodes = graph.nodes;
    expect(nodes.length).toBe(39);
    expect(nodes[nodes.length - 1].x).toEqual(640);

    const edges = graph.edges;
    expect(edges.length).toBe(21);
    expect(edges[edges.length - 1].points).toEqual(
      [{ "x": "209.99999999999977", "y": "840" }, { "x": "140", "y": "840" }]
    );
  });
});
