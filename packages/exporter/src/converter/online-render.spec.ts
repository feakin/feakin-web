import { OnlineRender } from "./online-render";

describe('OnlineRender', () => {
  it('from graphviz', () => {
    const output = OnlineRender.buildDotUrl2(`digraph {
  "A"
  "B"
  "C"
  "A" -> "B";
}`);

    expect(output.href).toBe("https://dreampuf.github.io/GraphvizOnline/#digraph%20%7B%0A%20%20%22A%22%0A%20%20%22B%22%0A%20%20%22C%22%0A%20%20%22A%22%20-%3E%20%22B%22;%0A%7D");
  });

  it('visual graphviz', () => {
    const output = OnlineRender.buildDotUrl(`digraph {
  "A"
  "B"
  "C"
  "A" -> "B";
}`);

    expect(output.href).toBe("http://magjac.com/graphviz-visual-editor/?dot=digraph%20%7B%0A%20%20%22A%22%0A%20%20%22B%22%0A%20%20%22C%22%0A%20%20%22A%22%20-%3E%20%22B%22;%0A%7D");
  });

  it('pako serde', () => {
    const input = "eNo1jTEKwzAQBL9itvYLlCrBeUFSXnP4zrHAkoxyKoLx333ByTazLAO7YSyiCHhVXufuOVwod57riVs8SRk9ktbEUVzevivBZk1KCF5FJ26LESjvrrZV2PQu0UpFmHh5aw9uVh6fPCJYbfqXhsj-nX7WfgCfHS8e"
    const origin = OnlineRender.pakoDeSerde(input);

    expect(origin).toEqual(`{"code":"graph TD;\\n    A\\n    Bi\\n    \\n","mermaid":"{\\n  \\"theme\\": \\"default\\"\\n}","updateEditor":false,"autoSync":true,"updateDiagram":false}`);

    const url = OnlineRender.buildMermaidUrl(`graph TD;
    A --> B
`);

    expect(url.href).toBe("https://mermaid.live/edit#pako:eNo1zcEKgzAQBNBfCXPWH0ih0KJfYI97Wdy1Bkwi6eZQxH9vCu2cBubBHJizKDyehffVPYYLJddyc31_dXdK6BC1RA7S0PEdCbZqVIJvVXThuhmB0tlo3YVNRwmWC_zC20s7cLU8vdMMb6XqHw2B22f8qfMDaros-Q");
  });
});
