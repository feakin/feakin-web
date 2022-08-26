import { DrawioExporter } from "./drawio-exporter";
import { Graph } from "../../model/graph";
import { ShapeType } from "../../model/node/shape";
import { MXCell } from "./mxgraph";
import * as fs from "fs";

describe('Drawio Exporter', () => {
  const graph = {
    nodes: [
      {
        id: "GxnAb7-mbH_Hpxf9r25g-1",
        label: "A",
        x: 220,
        y: 180,
        width: 120,
        height: 60
      },
      {
        id: "GxnAb7-mbH_Hpxf9r25g-2",
        label: "B",
        x: 220,
        y: 300,
        width: 120,
        height: 60
      },
      {
        id: "GxnAb7-mbH_Hpxf9r25g-4",
        label: "C",
        x: 50,
        y: 300,
        width: 120,
        height: 60
      }
    ],
    edges: [
      {
        id: "GxnAb7-mbH_Hpxf9r25g-3",
        points: [],
        controlPoints: [
          {
            x: 410,
            y: 210
          },
          {
            x: 410,
            y: 330
          }
        ],
        width: 0,
        height: 0,
        data: {
          source: "GxnAb7-mbH_Hpxf9r25g-1",
          target: "GxnAb7-mbH_Hpxf9r25g-2"
        }
      }
    ],
    props: {
      width: 850,
      height: 1100
    }
  };

  it('guid length', () => {
    const id = new DrawioExporter({} as any).guid();
    expect(id.length).toBe(20);
  });

  it('transpile', () => {
    const wrapper = new DrawioExporter(graph);
    const mxCells = wrapper.intermediate();

    expect(mxCells.length).toBe(6);
  });

  it('export triangle', () => {
    const triangle: Graph = {
      nodes: [{
        id: "4fGrBHPbXxLO9afZ4FaqV",
        label: "a",
        data: {
          shape: ShapeType.Triangle
        },
        width: 80,
        height: 60,
        x: 0,
        y: 0
      }],
      edges: []
    };
    const wrapper = new DrawioExporter(triangle);
    const cells: MXCell[] = wrapper.intermediate();

    expect(cells[2].attributes?.style).toContain("shape=mxgraph.basic.acute_triangle");
  });
});
