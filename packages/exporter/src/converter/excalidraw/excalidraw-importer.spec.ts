import { ExcalidrawImporter } from "./excalidraw-importer";
import { Graph } from "../../model/graph";

describe('ExcalidrawExporter', () => {
  it('triangle to line', () => {
    const excalidrawImporter = new ExcalidrawImporter(JSON.stringify({
      "type": "excalidraw",
      "version": 2,
      "source": "https://excalidraw.com",
      "elements": [
        {
          "id": "GDTNjV7Ki_swexSok4l4-",
          "type": "rectangle",
          "x": 20,
          "y": 123,
          "width": 216,
          "height": 79,
          "angle": 0,
          "strokeColor": "#000000",
          "backgroundColor": "transparent",
          "fillStyle": "hachure",
          "strokeWidth": 2,
          "strokeStyle": "solid",
          "roughness": 1,
          "opacity": 100,
          "groupIds": [],
          "strokeSharpness": "round",
          "seed": 968776656,
          "version": 9,
          "versionNonce": 1840973616,
          "isDeleted": false,
          "boundElements": [
            {
              "id": "3jsG2EoaHHef0GjBKGV0Y",
              "type": "arrow"
            }
          ],
          "updated": 1661010405641,
          "link": null,
          "locked": false
        }
      ],
      "appState": {
        "gridSize": null,
        "viewBackgroundColor": "#ffffff"
      },
      "files": {}
    }));

    const graph: Graph = excalidrawImporter.parse();
    let nodes = graph.nodes;
    expect(nodes.length).toEqual(1);
    expect(nodes[0].x).toEqual(20);
    expect(nodes[0].y).toEqual(123);
  });
});
