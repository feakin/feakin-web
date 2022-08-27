import DrawioEncode from './encode/drawio-encode';
import { MXCell, Mxfile, MxGraph } from './mxgraph';
import * as fs from "fs";
import * as path from "path";
import { DrawioImporter } from "./drawio-importer";
import { Edge, Graph } from "../../model/graph";

const pwd = process.env["PWD"] || process.cwd();

describe('DrawioEncoder', () => {
  let cells: MXCell[] = [];
  let data: string;
  let mxGraph: MxGraph;

  beforeAll(() => {
    const drawioFile = path.resolve(pwd, "./_fixtures/drawio/android-ag.drawio");
    data = fs.readFileSync(drawioFile, { encoding: 'utf8', flag: 'r' });

    const encoded: Mxfile | any = DrawioEncode.decodeXml(data);
    mxGraph = DrawioEncode.xml2obj(encoded) as MxGraph;

    cells = mxGraph.mxGraphModel.root.mxCell;
  });

  it('decode for relations', () => {
    expect(cells.length).toBe(62);
  });

  it('control point', () => {
    const drawioConverter = new DrawioImporter(data);
    const graph = drawioConverter.parse();

    const edges = graph.edges.filter((node: Edge) => node.id === "c829ialIT6bnUCAQVo3g-13");
    expect(edges[0].points.length).toBe(2);
    expect(edges[0].controlPoints?.length).toBe(1);
  });

  it('control points', () => {
    const content = `<mxfile host="Electron" modified="2022-08-22T00:32:25.524Z" agent="5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/20.2.3 Chrome/102.0.5005.167 Electron/19.0.11 Safari/537.36" etag="1UZzcpjXcl82ygIiAaWL" version="20.2.3" type="device"><diagram id="fZ2OKlA7e2musCGqIjqR" name="Page-1">zVVNb9swDP01PnbwR5N1xzRNm8MGDMhh22lQbdbWYJuGQsf2fv0km4osGAnaSzvkEPHpkSYfSTtItlX/pERTfMMMyiAOsz5IHoI4jsP1Wv8ZZJiQSP8mJFcyY8wBB/kXGAwZbWUGR49IiCXJxgdTrGtIycOEUtj5tBcs/ac2IocFcEhFuUR/yIyKCb1bhQ7fg8wL++Qo5JtKWDIDx0Jk2M2gZBckW4VI06nqt1Aa9awuk9/jhdtzYgpqeo3DU19vnj/fVM/73/umf/mi4lV+k3BuNNiCIdP1s4mKCsyxFuXOofcK2zoDEzXUluN8RWw0GGnwDxAN3EzREmqooKrkW+gl/Zydf5lQn1ZsPfQceTQGa9SkhrOTMWZexnRuo2X90ladxlyN31SsqfCihgwdsVUpXBHOzqJQOdAVXnzutN4RwAp0ctpPQSlInvw8BM9qfuax60YpMcwIDcqajrPI3w2gCbx3t3Z7eOvsNj2+kp8kHl8fpgysNSvFQeO4vWH0uOiTKFuWYbMYRn/UukISHBoxNqbTLxx/rDgeKIL+en+X/bAvrNgXIrpju3O7H1lOMdv7dXi5hTMZ365SvFDp/r9TKQk/WqXbhUrbD1dp9X4iadN9R6b9dJ/jZPcP</diagram></mxfile>`;

    const drawioConverter = new DrawioImporter(content);
    const graph = drawioConverter.parse();

    const points = graph.edges[0].controlPoints!;

    expect(points.length).toBe(2);
    expect(points[0]).toEqual({ x: 410, y: 210 });
    expect(points[1]).toEqual({ x: 410, y: 330 });
  });

  it('filter node', () => {
    const drawioConverter = new DrawioImporter(data);
    const graph: Graph = drawioConverter.parse();

    expect(graph.prop?.height).toBe(1100);
    expect(graph.prop?.width).toBe(850);

    const nodes = graph.nodes;
    expect(nodes.length).toBe(39);
    expect(nodes[nodes.length - 1].x).toEqual(640);

    const edges = graph.edges;
    expect(edges.length).toBe(21);
    expect(edges[edges.length - 1].points).toEqual(
      [{ "x": 209.99999999999977, "y": 840 }, { "x": 140, "y": 840 }]
    );

    expect(edges[edges.length - 1].width).toEqual(0);
  });

  it('edge with', () => {
    const drawioConverter = new DrawioImporter(data);
    const graph: Graph = drawioConverter.parse();

    const edges = graph.edges;
    expect(edges.length).toBe(21);
  });
});
