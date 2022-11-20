import * as fs from "fs";

import { Graph } from "../model/graph";
import { DrawioExporter } from "./drawio/drawio-exporter";
import { MermaidImporter } from "./mermaid/mermaid-importer";
import { ExcalidrawExporter } from "./excalidraw/excalidraw-exporter";
import { DrawioImporter } from "./drawio/drawio-importer";
import { DotExporter } from "./dot/dot-exporter";
import { DotWasmImporter } from "./dot/dot-wasm-importer";

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

  it('from dot', async () => {
    const executor = new DotWasmImporter(`
digraph {
  a -> b
  a -> c
  b -> d
  c -> d
  e
}
`);
    const graph: Graph = await executor.parsePromise();

    const output = new ExcalidrawExporter(graph).intermediate();
    const edges = output.elements.filter(e => e.type === "arrow");
    const nodes = output.elements.filter(e => e.type === "text");

    expect(edges.length).toBe(4);
    expect(nodes.length).toBe(5);

    fs.writeFileSync("./test/from-dot.excalidraw", JSON.stringify(output, null, 2));
  });

  it('from dot to drawio', async () => {
    const executor = new DotWasmImporter(`
digraph {
  a -> b
  a -> c
  b -> d
  c -> d
  e
}
`);
    const graph: Graph = await executor.parsePromise();

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

  it('from dot to drawio', async () => {
    const executor = new DotWasmImporter(`digraph G {
  compound=true;
  subgraph cluster0 {
    a [shape="triangle", fillcolor=red, style=filled];
    b [shape="diamond"];
    a -> b;
    c -> d;
  }
  subgraph cluster1 {
    e -> g;
    e -> f;
  }
}`);
    const graph: Graph = await executor.parsePromise();

    const output = new DrawioExporter(graph).export();

    fs.writeFileSync("./test/from-dot.drawio", output);
  });

  it('from drawio to graphviz 2', () => {
    const data = fs.readFileSync('_fixtures/drawio/user-story-mapping.drawio', 'utf8');
    const executor = new DrawioImporter(data);
    const graph: Graph = executor.parse();

    const output = new DotExporter(graph).export();

    expect(output).toContain('"Persona 1"');
  });
});
