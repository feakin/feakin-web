import * as fs from "fs";

import { DotImporter } from "./dot/dot-importer";
import { Graph } from "../model/graph";
import { DrawioExporter } from "./drawio/drawio-exporter";
import { MermaidImporter } from "./mermaid/mermaid-importer";
import { ExcalidrawExporter } from "./excalidraw/excalidraw-exporter";
import { DrawioImporter } from "./drawio/drawio-importer";
import { DotExporter } from "./dot/dot-exporter";

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

    const output = new ExcalidrawExporter(graph).intermediate();
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

    const output = new ExcalidrawExporter(graph).intermediate();
    const edges = output.elements.filter(e => e.type === "arrow");
    const nodes = output.elements.filter(e => e.type === "text");

    expect(edges.length).toBe(4);
    expect(nodes.length).toBe(5);

    fs.writeFileSync("./test/from-dot.excalidraw", JSON.stringify(output, null, 2));
  });

  it('from dot to drawio', () => {
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

    const output = new DrawioExporter(graph).export();

    fs.writeFileSync("./test/from-dot.drawio", output);
  });

  it('from drawio to graphviz', () => {
    const data = fs.readFileSync('_fixtures/drawio/android-ag.drawio', 'utf8');
    const executor = new DrawioImporter(data);
    const graph: Graph = executor.parse();

    const output = new DotExporter(graph).export();

    fs.writeFileSync("./test/from-drawio.dot", output);
  });
});
