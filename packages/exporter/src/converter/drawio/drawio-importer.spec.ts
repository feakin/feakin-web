import DrawioEncode from './encode/drawio-encode';
import { MXCell, Mxfile, MxGraph } from './mxgraph';
import * as fs from "fs";
import * as path from "path";
import { DrawioImporter } from "./drawio-importer";
import { Edge, Graph } from "../../model/graph";
import { edgeDecoratorForTest } from "../../model/edge/decorator/edge-decorator";

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

    expect(graph.props?.height).toBe(1100);
    expect(graph.props?.width).toBe(850);

    const nodes = graph.nodes;
    expect(nodes.length).toBe(39);
    expect(nodes[nodes.length - 1].x).toEqual(640);

    const edges = graph.edges;
    expect(edges.length).toBe(21);
    expect(edges[edges.length - 1].points).toEqual(
      [
        {
          "x": 200,
          "y": 930
        },
        {
          "x": 130,
          "y": 930
        }
      ]
    );

    expect(edges[edges.length - 1].width).toEqual(0);
  });

  it('edge with', () => {
    const drawioConverter = new DrawioImporter(data);
    const graph: Graph = drawioConverter.parse();

    const edges = graph.edges;
    expect(edges.length).toBe(21);
  });

  it('label', () => {
    const drawioConverter = new DrawioImporter(data);
    const graph: Graph = drawioConverter.parse();

    const nodes = graph.nodes.filter(node => node.label == "取决于");
    expect(nodes.length).toBe(1);

    expect(nodes[0].x!.toFixed(0)).toEqual("640");
    expect(nodes[0].y).toEqual(510);
  });

  it('relative edge', () => {
    const drawioConverter = new DrawioImporter(data);
    const graph: Graph = drawioConverter.parse();

    const nodes = graph.nodes.filter(node => node.label == "影响到");
    expect(nodes.length).toBe(1);

    expect(nodes[0].x!.toFixed(0)).toEqual("390");
    expect(nodes[0].y).toEqual(633);
  });

  it('for browser', () => {
    const drawioConverter = new DrawioImporter(`<mxGraphModel dx="541" dy="372" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="ARSg04o7xmWB_3SNBJeL-1" value="<pre><span class=&quot;s&quot;>Hello, world!</span></pre>" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"><mxGeometry x="360" y="430" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel>`, true);
    const graph: Graph = drawioConverter.parse();

    expect(graph.nodes.length).toBe(1);
  });

  it('styled arrow', () => {
    const drawioConverter = new DrawioImporter(`<mxGraphModel dx="962" dy="970" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="VSaEne3B5YX8t8c1DR0t-1" value="" style="endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;" edge="1" parent="1">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="360" y="330" as="sourcePoint"/>
        <mxPoint x="480" y="330" as="targetPoint"/>
      </mxGeometry>
    </mxCell>
    <mxCell id="VSaEne3B5YX8t8c1DR0t-2" value="" style="endArrow=openAsync;startArrow=diamondThin;html=1;rounded=0;startFill=1;endFill=0;" edge="1" parent="1">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="360" y="380" as="sourcePoint"/>
        <mxPoint x="480" y="380" as="targetPoint"/>
      </mxGeometry>
    </mxCell>
    <mxCell id="VSaEne3B5YX8t8c1DR0t-5" value="" style="endArrow=block;startArrow=diamond;html=1;rounded=0;strokeWidth=2;startFill=0;endFill=0;" edge="1" parent="1">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="360" y="430" as="sourcePoint"/>
        <mxPoint x="480" y="430" as="targetPoint"/>
      </mxGeometry>
    </mxCell>
  </root>
</mxGraphModel>
`, true);
    const graph: Graph = drawioConverter.parse();

    expect(edgeDecoratorForTest(graph.edges[0].props!.decorator!)).toEqual(".....");
    expect(edgeDecoratorForTest(graph.edges[1].props!.decorator!)).toEqual("◆─────>");
    expect(edgeDecoratorForTest(graph.edges[2].props!.decorator!)).toEqual("◆─────▷");
  });

  it('location from exit entry', () => {
    const drawioConverter = new DrawioImporter(`<mxGraphModel dx="962" dy="970" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="c829ialIT6bnUCAQVo3g-42" value="Android 依赖分析" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
      <mxGeometry x="340" y="190" width="120" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="c829ialIT6bnUCAQVo3g-37" value="生命周期" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
      <mxGeometry x="200" y="340" width="120" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="c829ialIT6bnUCAQVo3g-43" value="" style="endArrow=classic;html=1;rounded=0;exitX=0.25;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="c829ialIT6bnUCAQVo3g-42" target="c829ialIT6bnUCAQVo3g-37">
      <mxGeometry width="50" height="50" relative="1" as="geometry">
        <mxPoint x="480" y="470" as="sourcePoint"/>
        <mxPoint x="530" y="420" as="targetPoint"/>
      </mxGeometry>
    </mxCell>
  </root>
</mxGraphModel>
`, true);
    const graph: Graph = drawioConverter.parse();


    expect(graph.edges[0].points).toEqual([
      {
        "x": 370,
        "y": 250
      },
      {
        "x": 260,
        "y": 340
      }
    ]);
  });

  it('direct position', () => {
    const drawioConverter = new DrawioImporter(`<mxGraphModel dx="962" dy="970" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="c829ialIT6bnUCAQVo3g-4" value="编译中" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#0050ef;fontColor=#ffffff;strokeColor=#001DBC;" parent="1" vertex="1">
      <mxGeometry x="200" y="800" width="120" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="c829ialIT6bnUCAQVo3g-24" value="Gradle" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" parent="1" vertex="1">
      <mxGeometry x="10" y="800" width="120" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="c829ialIT6bnUCAQVo3g-63" style="edgeStyle=orthogonalEdgeStyle;curved=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0;exitY=0.5;exitDx=0;exitDy=0;strokeWidth=1;" parent="1" source="c829ialIT6bnUCAQVo3g-4" target="c829ialIT6bnUCAQVo3g-24" edge="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="209.99999999999977" y="740" as="sourcePoint"/>
        <mxPoint x="140" y="740" as="targetPoint"/>
      </mxGeometry>
    </mxCell>
  </root>
</mxGraphModel>
`, true);
    const graph: Graph = drawioConverter.parse();

    // actual: [{ x: 200, y: 830 }, { 130, 830 }]
    expect(graph.edges[0].points).toEqual([
      {
        "x": 200,
        "y": 830
      },
      {
        "x": 10,
        "y": 800
      }
    ]);
  });
});
