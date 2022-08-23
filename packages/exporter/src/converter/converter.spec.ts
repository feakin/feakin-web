import * as fs from "fs";
import { MermaidImporter } from "./mermaid/mermaid-importer";
import { Graph } from "../model/graph";
import { ExcalidrawExporter } from "./excalidraw/excalidraw-exporter";
import { DotImporter } from "./dot/dot-importer";

describe('Converter', () => {
  it('from mermaid', () => {
    const executor = new MermaidImporter(`
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`);
    const graph: Graph = executor.parse();

    const output = new ExcalidrawExporter(graph).export();
    const edges = output.elements.filter(e => e.type === "arrow");
    const nodes = output.elements.filter(e => e.type === "text");

    expect(edges.length).toBe(4);
    expect(nodes.length).toBe(4);

    fs.writeFileSync("./test/from-mermaid.excalidraw", JSON.stringify(output, null, 2));
  });
  it('from dot', () => {
    const executor = new DotImporter(`
digraph {
  a -> b
  a -> c
  b -> d
  c -> d
  e
}
`);
    const graph: Graph = executor.parse();

    const output = new ExcalidrawExporter(graph).export();
    const edges = output.elements.filter(e => e.type === "arrow");
    const nodes = output.elements.filter(e => e.type === "text");

    expect(edges.length).toBe(4);
    expect(nodes.length).toBe(5);

    fs.writeFileSync("./test/from-dot.excalidraw", JSON.stringify(output, null, 2));
  });
});
