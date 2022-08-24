import { DrawioExporter } from "./drawio-exporter";
import * as fs from "fs";

describe('Drawio Exporter', () => {
  it('guid length', () => {
    const id = new DrawioExporter({} as any).guid();
    expect(id.length).toBe(20);
  });

  it('convert model to file', () => {
    const graph = {
      "nodes": [
        {
          "id": "GxnAb7-mbH_Hpxf9r25g-1",
          "label": "A",
          "x": 220,
          "y": 180,
          "width": 120,
          "height": 60
        },
        {
          "id": "GxnAb7-mbH_Hpxf9r25g-2",
          "label": "B",
          "x": 220,
          "y": 300,
          "width": 120,
          "height": 60
        },
        {
          "id": "GxnAb7-mbH_Hpxf9r25g-4",
          "label": "C",
          "x": 50,
          "y": 300,
          "width": 120,
          "height": 60
        }
      ],
      "edges": [
        {
          "id": "GxnAb7-mbH_Hpxf9r25g-3",
          "points": [],
          "controlPoints": [
            {
              "x": 410,
              "y": 210
            },
            {
              "x": 410,
              "y": 330
            }
          ],
          "width": 0,
          "height": 0,
          "data": {
            "source": "GxnAb7-mbH_Hpxf9r25g-1",
            "target": "GxnAb7-mbH_Hpxf9r25g-2"
          }
        }
      ],
      "props": {
        "width": 850,
        "height": 1100
      }
    };

    const wrapper = new DrawioExporter(graph);
    const mxfile = wrapper.export();

    fs.writeFileSync('./test/test.drawio', DrawioExporter.toXml(mxfile));
  });
});
