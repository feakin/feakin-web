import { dagreLayout, layoutFromGraph } from './dagre-layout';
import { DagreRelation } from "./dagre-relation";

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

  it('target should have width and height', () => {
    const relations: DagreRelation[] = [
      { source: { name: 'A' } },
      { source: { name: 'B' } },
      { source: { name: 'B' }, target: { name: 'C' } },
    ]

    const layout = dagreLayout(relations);

    expect(layout.nodes[2].width).toBe(100);
    expect(layout.nodes[2].height).toBe(40);
  });

  it('layout from graph', () => {
    const graph = {"nodes":[{"label":"cluster0","subgraph":true,"x":168,"y":98,"width":320,"height":180,"id":"yNr6kZdqV_1OoeIio2AA7"},{"label":"cluster1","subgraph":true,"x":508,"y":98,"width":320,"height":180,"id":"hZFCufal18PpLumkjBBPF"},{"id":"kEuPirVKzfs0aVqpYFQRf","label":"a","data":{"parentId":"cluster0"},"width":100,"height":40,"x":93,"y":53},{"id":"HN1cw66Ksed4YQ_hRd_Tq","label":"b","data":{"parentId":"cluster0"},"width":100,"height":40,"x":93,"y":143},{"id":"9ZytZgN3_BtFXe8tIDVbq","label":"c","data":{"parentId":"cluster0"},"width":100,"height":40,"x":243,"y":53},{"id":"uy-JwCFfiTDKlR6u7QGtV","label":"d","data":{"parentId":"cluster0"},"width":100,"height":40,"x":243,"y":143},{"id":"iMznUPHsRqTQo9kpjUSsz","label":"e","data":{"parentId":"cluster1"},"width":100,"height":40,"x":508,"y":53},{"id":"n4RZlnMDf_8bH3mGkBbla","label":"g","data":{"parentId":"cluster1"},"width":100,"height":40,"x":433,"y":143},{"id":"NpbEQN50hzVOBFyOxeSec","label":"f","data":{"parentId":"cluster1"},"width":100,"height":40,"x":583,"y":143}],"edges":[{"id":"E9u8LaF5E2BwicvV2UPje","points":[{"x":93,"y":73},{"x":93,"y":98},{"x":93,"y":123}],"data":{"parentId":"cluster0","source":"kEuPirVKzfs0aVqpYFQRf","target":"HN1cw66Ksed4YQ_hRd_Tq","sourceId":"kEuPirVKzfs0aVqpYFQRf","targetId":"HN1cw66Ksed4YQ_hRd_Tq"}},{"id":"_l4FoK0f2iWT1uJcG8jru","points":[{"x":243,"y":73},{"x":243,"y":98},{"x":243,"y":123}],"data":{"parentId":"cluster0","source":"9ZytZgN3_BtFXe8tIDVbq","target":"uy-JwCFfiTDKlR6u7QGtV","sourceId":"9ZytZgN3_BtFXe8tIDVbq","targetId":"uy-JwCFfiTDKlR6u7QGtV"}},{"id":"VW8zly0s-hJefA4I5Ln-z","points":[{"x":474.6666666666667,"y":73},{"x":433,"y":98},{"x":433,"y":123}],"data":{"parentId":"cluster1","source":"iMznUPHsRqTQo9kpjUSsz","target":"n4RZlnMDf_8bH3mGkBbla","sourceId":"iMznUPHsRqTQo9kpjUSsz","targetId":"n4RZlnMDf_8bH3mGkBbla"}},{"id":"GdhjLTb-AvujC0AWR7Q-6","points":[{"x":541.3333333333334,"y":73},{"x":583,"y":98},{"x":583,"y":123}],"data":{"parentId":"cluster1","source":"iMznUPHsRqTQo9kpjUSsz","target":"NpbEQN50hzVOBFyOxeSec","sourceId":"iMznUPHsRqTQo9kpjUSsz","targetId":"NpbEQN50hzVOBFyOxeSec"}}]}
    const layout = layoutFromGraph(graph);

    expect(layout.nodes.length).toBe(9);
    const subgraph = layout.nodes.filter(node => node.label === 'cluster0');
    expect(subgraph.length).toBe(1);
    expect(subgraph[0].subgraph).toBeTruthy();
  });
});
