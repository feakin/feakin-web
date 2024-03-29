import * as fs from "fs";
import { CanvasConnectorDrawing, insertControlPointsInCenter, preparePoints } from "./canvas-connector-drawing";
import { Arrowhead } from "../../../model/edge/decorator/arrowhead";
import { dataURLtoFileData } from "../helper/data-url";
import { LineStyle } from "../../../model/edge/decorator/line-style";
import { LineDashStyle } from "../../../model/edge/decorator/line-dash-style";
import { Edge } from "../../../model/graph";

describe('CanvasConnectorDrawing', () => {
  let canvas: any, ctx: any;
  beforeEach(function () {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    if (!fs.existsSync("test")) {
      fs.mkdirSync('test');
    }
  });

  it('should draw arrowhead notched', () => {
    const edge: Edge = {
      id: "",
      points: [{ x: 10, y: 10 }, { x: 20, y: 40 }, { x: 20, y: 40 }, { x: 50, y: 50 }],
      props: {
        stroke: {
          color: "black",
          width: 2,
        },
        decorator: {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.LONG_DASH,
          lineType: LineStyle.CURVED,
          startArrowhead: Arrowhead.NOTCHED,
          endArrowhead: Arrowhead.NOTCHED,
        }
      }
    }

    CanvasConnectorDrawing.paint(ctx, edge.props!, edge.points);

    const image = canvas.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/arrow-notched.png', fileData.data);
  });

  it('should merge points', function () {
    const mergedPoints = insertControlPointsInCenter([{ x: 10, y: 10 }, { x: 20, y: 40 }], [{ x: 50, y: 50 }]);
    expect(mergedPoints).toEqual([{ x: 10, y: 10 }, { x: 50, y: 50 }, { x: 20, y: 40 }]);
  });

  it('prepare points', function () {
    const mergedPoints = preparePoints([{ x: 10, y: 10 }, { x: 20, y: 40 }], [{ x: 50, y: 50 }]);
    expect(mergedPoints).toEqual([{ x: 10, y: 10 }, { x: 50, y: 50 }, { x: 20, y: 40 }]);
  });
});
