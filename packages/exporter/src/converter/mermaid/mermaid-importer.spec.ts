import { MermaidImporter } from "./mermaid-importer";

describe('MermaidImporter', () => {
  it('sample', () => {
    const source = `graph TD;
    A-->B
    B-->C;`;

    const executor = new MermaidImporter(source);
    const result = executor.parse();
    expect(result.nodes.length).toBe(3);
  });
});
