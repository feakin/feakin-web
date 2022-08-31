import * as fs from "fs";
import { ConnectorDrawing } from "./connector-drawing";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { dataURLtoFileData } from "../helper/data-url";
import { EdgeDecorator, LineStyle, LineType } from "@feakin/exporter";

describe('ArrowHeadDrawing', () => {
  let canvas: any, ctx: any;
  beforeEach(function () {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    if (!fs.existsSync("test")) {
      fs.mkdirSync('test');
    }
  });

  it('should draw arrowhead notched', () => {
    let decorator: EdgeDecorator = {
      lineStyle: LineStyle.SOLID,
      lineType: LineType.LINE,
      startArrowhead: Arrowhead.NOTCHED,
      endArrowhead: Arrowhead.NOTCHED,
    }

    ConnectorDrawing.render(ctx, decorator, [{ x: 10, y: 10 }, { x: 50, y: 50 }], 10);

    const image = canvas.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/arrow-notched.png', fileData.data);
  });
});
