import { flow } from './mermaid-flow';

describe('feakinExporter', () => {
  it('should parse basic mermaid graph', () => {
    let flow1 = flow(`graph TD;
    A-->B
    B-->C;`);

    expect(flow1.direction).toBe('TD');
    expect(flow1.vertices['A'].id).toBe('A');
    expect(flow1.edges.length).toBe(2);
  });

  it('should parse subgraph', () => {
    let flow1 = flow(`flowchart TB
    c1-->a2
    subgraph ide1 [one]
    a1-->a2
    end`);

    expect(flow1.direction).toBe('TB');
    expect(flow1.subGraphs.length).toBe(1);
  });
});
