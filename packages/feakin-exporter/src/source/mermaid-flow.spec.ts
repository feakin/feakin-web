import { parseFlow } from './mermaid-flow';

describe('feakinExporter', () => {
  it('should parse basic mermaid graph', () => {
    const flow = parseFlow(`graph TD;
    A-->B
    B-->C;`);

    expect(flow.direction).toBe('TD');
    expect(flow.vertices['A'].id).toBe('A');
    expect(flow.edges.length).toBe(2);
  });

  it('should parse subgraph', () => {
    const flow = parseFlow(`flowchart TB
    c1-->a2
    subgraph ide1 [one]
    a1-->a2
    end`);

    expect(flow.direction).toBe('TB');
    expect(flow.subGraphs.length).toBe(1);
  });

  it('should parse description', () => {
    const flow = parseFlow(`flowchart LR
    id1[This is the text in the box]`);

    expect(flow.direction).toBe('LR');
    expect(flow.vertices['id1'].text).toBe("This is the text in the box");
  });
});
