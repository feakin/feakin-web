import { DotImporter } from "./dot-importer";
import { Graph } from "../../model/graph";

describe('DotImporter', () => {
  it('edge with', () => {
    const importer = new DotImporter(`strict graph {
  a -- b
  a -- b
  b -- a [color=blue]
}`);
    const graph: Graph = importer.parse();

    expect(graph.nodes.length).toBe(2);
    expect(graph.edges.length).toBe(3);
  });

  it('label name', () => {
    const importer = new DotImporter(`digraph {
0 -> 1 [ len=2, label="(1, 0)"];
0 -> 1 [ len=0.5, dir=none, weight=10];
1 -> 0 [ len=2, label="(0, -1)"];
}`);
    const graph: Graph = importer.parse();

    console.log(graph);
    expect(graph.nodes.length).toBe(2);
    expect(graph.edges.length).toBe(3);
  });
});
