import { dagreLayout, DagreRelation } from './dagre-layout';

describe('feakinExporter', () => {
  it('layout', () => {
    const relations: DagreRelation[] = [
      { source: { name: 'A' } },
      { source: { name: 'B' } },
      { source: { name: 'B' }, target: { name: 'C' } },
    ]

    const layout = dagreLayout(relations);

    expect(layout.nodes.length).toBe(3);
    expect(layout.nodes[0].width).toBe(100);
    expect(layout.nodes[0].height).toBe(40);
    expect(layout.edges.length).toBe(1);
  });
});
