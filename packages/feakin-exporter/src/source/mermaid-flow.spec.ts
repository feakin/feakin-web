import { flow } from './mermaid-flow';

describe('feakinExporter', () => {
  it('should work', () => {
    let flow1 = flow(`graph TD;
    A-->B
    B-->C;`);

    expect(flow1.direction).toBe(' TD');
    expect(flow1.vertices['A'].id).toBe('A');
    expect(flow1.edges.length).toBe(2);
  });
});
