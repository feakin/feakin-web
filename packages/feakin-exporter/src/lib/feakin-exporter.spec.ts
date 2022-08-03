import { dagreLayout, DagreRelation, feakinExporter } from './feakin-exporter';

describe('feakinExporter', () => {
  it('should work', () => {
    expect(feakinExporter()).toEqual('feakin-exporter');
  });

  it('layout', () => {
    const relations: DagreRelation[] = [
      { source: { name: 'A' } },
      { source: { name: 'B' } },
      { source: { name: 'B' }, target: { name: 'C' } },
    ]

    const layout = dagreLayout(relations);
    console.log(JSON.stringify(layout, null, 2));
    expect(layout.nodes.length).toBe(3);
    expect(layout.edges.length).toBe(1);
  });
});
