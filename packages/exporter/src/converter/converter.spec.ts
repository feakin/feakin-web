import * as fs from "fs";
import { DargeFlowConverter } from "./mermaid/darge-flow-converter";
import { Graph } from "../model/graph";
import { ExcalidrawExporter } from "./excalidraw/excalidraw-exporter";

describe('Converter', () => {
  it('decode for relations', () => {
    const executor = new DargeFlowConverter();
    const graph: Graph = executor.sourceToDagre(`
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`);

    const output = new ExcalidrawExporter(graph).export();
    const edges = output.elements.filter(e => e.type === "arrow");
    const nodes = output.elements.filter(e => e.type === "text");

    expect(edges.length).toBe(4);
    expect(nodes.length).toBe(4);

    fs.writeFileSync("./test/from-mermaid.excalidraw", JSON.stringify(output, null, 2));
  });
});
