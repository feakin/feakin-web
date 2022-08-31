import * as fs from "fs";
import { ConnectorDrawing } from "./connector-drawing";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { dataURLtoFileData } from "../helper/data-url";
import { LineType } from "../../model/edge/decorator/line-type";
import { LineDashStyle } from "../../model/edge/decorator/line-dash-style";
import { Edge } from "../../model/graph";

describe('ConnectorDrawing', () => {
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
          lineDashStyle: LineDashStyle.LONG_DASH,
          lineType: LineType.CURVE,
          startArrowhead: Arrowhead.NOTCHED,
          endArrowhead: Arrowhead.NOTCHED,
        }
      }
    }

    ConnectorDrawing.render(ctx, edge.props!, edge.points);

    const image = canvas.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/arrow-notched.png', fileData.data);
  });
});
