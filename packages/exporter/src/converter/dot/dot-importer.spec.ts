import { DotImporter } from "./dot-importer";
import { Graph } from "../../model/graph";

describe('DotImporter', () => {
  it('edge with', () => {
    const importer = new DotImporter(`strict graph {
  a -- b
  a -- b
  b -- a [color=blue]
}`);
    const graph: Graph = importer.transpile();

    expect(graph.nodes.length).toBe(2);
    expect(graph.nodes[0].label).toBe("a");
    expect(graph.nodes[1].label).toBe("b");
    expect(graph.edges.length).toBe(3);
    expect(graph.edges[0]).toEqual({ data: { source: "a", target: "b" }, id: "a_b", points: [] });
    expect(graph.edges[1]).toEqual({ data: { source: "a", target: "b" }, id: "a_b_1", points: [] });
    expect(graph.edges[2]).toEqual({ data: { source: "b", target: "a", color: "blue" }, id: "b_a", points: [] });
  });

  it('label name', () => {
    const importer = new DotImporter(`digraph {
0 -> 1 [ len=2, label="(1, 0)"];
0 -> 1 [ len=0.5, dir=none, weight=10];
1 -> 0 [ len=2, label="(0, -1)"];
}`);
    const graph: Graph = importer.transpile();

    expect(graph.nodes.length).toBe(2);
    expect(graph.edges.length).toBe(3);
    expect(graph.edges[0]).toEqual({
      data: { source: "0", target: "1", label: "(1, 0)", len: 2 },
      id: "0_1",
      points: []
    });
  });

  it('single node', () => {
    const importer = new DotImporter(`strict graph {
  sf [label="Sunflowers"]
}`);
    const graph: Graph = importer.transpile();

    expect(graph.nodes.length).toBe(1);
    expect(graph.nodes[0].label).toBe("Sunflowers");
    expect(graph.edges.length).toBe(0);
  });

  it('new id', () => {
    const importer = new DotImporter(`strict graph {
  0 -> 1 [ len=2, label="(1, 0)"];
  0 -> 1 [ len=0.5, dir=none, weight=10];
  1 -> 0 [ len=2, label="(0, -1)"];
}`);
    const graph: Graph = importer.parse();

    expect(graph.nodes.length).toBe(2);
    expect(graph.nodes[0].label).toBe("0");

    expect(graph.nodes[0].x).toBe(0);
    expect(graph.nodes[0].y).toBe(0);

    expect(graph.nodes[0].height).toBe(40);
    expect(graph.nodes[0].width).toBe(100);
  });

  it('import triangle shape', () => {
    const importer = new DotImporter(`digraph {
  "A" [shape="triangle"]
  "B"
  "C"
  "A" -> "B";
}`);
    const graph: Graph = importer.parse();

    expect(graph.nodes.length).toBe(3);
    expect(graph.nodes[0].data!.parentId).not.toBeTruthy();
    expect(graph.nodes[0].data!.shape).toBe("triangle");
  });

  it('subgraph', () => {
    const importer = new DotImporter(`digraph G {
  compound=true;
  subgraph cluster0 {
    a -> b;
    c -> d;
  }
  subgraph cluster1 {
    e -> g;
    e -> f;
  }
}`);
    const graph: Graph = importer.parse();

    expect(graph.nodes.length).toBe(9);
    expect(graph.nodes[2].data!.parentId).toBe("cluster0");
  });
});
