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
    const graph = {
      "nodes": [{
        "id": "Mm6EZ6yD7r4dToxNLw07_",
        "label": "a",
        "data": { "parentId": "cluster0" }
      }, {
        "id": "bj2fq3ccEaSrfV5cpPUHg",
        "label": "b",
        "data": { "parentId": "cluster0" }
      }, {
        "id": "aYSv2ZqTzxU4aGJUt0UP2",
        "label": "c",
        "data": { "parentId": "cluster0" }
      }, {
        "id": "L9UFo0XLYzCluyYWMGS3p",
        "label": "d",
        "data": { "parentId": "cluster0" }
      }, {
        "id": "iuPvNK9v0ZkbZrDyc2tMm",
        "label": "e",
        "data": { "parentId": "cluster1" }
      }, {
        "id": "t86auNKTLOL8kg3frnKgJ",
        "label": "g",
        "data": { "parentId": "cluster1" }
      }, { "id": "91NMBiip9eVTM2kIIRskz", "label": "f", "data": { "parentId": "cluster1" } }],
      "edges": [{
        "id": "fnU0eLXcMPxdBVoeupFHr",
        "points": [],
        "data": {
          "parentId": "cluster0",
          "source": "a",
          "target": "b",
          "sourceId": "Mm6EZ6yD7r4dToxNLw07_",
          "targetId": "bj2fq3ccEaSrfV5cpPUHg"
        }
      }, {
        "id": "oFreFUDioWNi72ZB-Pd_Z",
        "points": [],
        "data": {
          "parentId": "cluster0",
          "source": "c",
          "target": "d",
          "sourceId": "aYSv2ZqTzxU4aGJUt0UP2",
          "targetId": "L9UFo0XLYzCluyYWMGS3p"
        }
      }, {
        "id": "DEGa93Uimai2DX1-7rk10",
        "points": [],
        "data": {
          "parentId": "cluster1",
          "source": "e",
          "target": "g",
          "sourceId": "iuPvNK9v0ZkbZrDyc2tMm",
          "targetId": "t86auNKTLOL8kg3frnKgJ"
        }
      }, {
        "id": "D0v4kViC-eRR2D4E7AoSf",
        "points": [],
        "data": {
          "parentId": "cluster1",
          "source": "e",
          "target": "f",
          "sourceId": "iuPvNK9v0ZkbZrDyc2tMm",
          "targetId": "91NMBiip9eVTM2kIIRskz"
        }
      }]
    }
    const layout = layoutFromGraph(graph);

    expect(layout.nodes.length).toBe(9);
    const subgraph = layout.nodes.filter(node => node.label === 'cluster0');
    expect(subgraph.length).toBe(1);
  });
});
