import { flowTranspiler } from './flow-transpiler';

describe('flow transpiler', () => {
  it('should parse basic mermaid graph', () => {
    const flow = flowTranspiler(`graph TD;
    A-->B
    B-->C;`);

    expect(flow.direction).toBe('TD');
    expect(flow.nodes['A'].id).toBe('A');
    expect(flow.edges.length).toBe(2);
    expect(Object.values(flow.nodes).length).toBe(3);
  });

  it('should parse subgraph', () => {
    const flow = flowTranspiler(`flowchart TB
    c1-->a2
    subgraph ide1 [one]
    a1-->a2
    end`);

    expect(flow.direction).toBe('TB');
    expect(flow.subGraphs.length).toBe(1);
  });

  it('should parse description', () => {
    const flow = flowTranspiler(`flowchart LR
    id1[This is the text in the box]`);

    expect(flow.direction).toBe('LR');
    expect(flow.nodes['id1'].text).toBe("This is the text in the box");
  });
});
