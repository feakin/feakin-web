import * as fs from "fs";
import { ArrowHeadDrawing } from "./arrow-head-drawing";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { dataURLtoFileData } from "../helper/data-url";

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
    ArrowHeadDrawing.canvas(ctx, Arrowhead.NOTCHED, { x: 0, y: 0 }, 10);

    const image = canvas.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/arrow-notched.png', fileData.data);
  });

  it('should draw arrowhead hollow', () => {
    ArrowHeadDrawing.canvas(ctx, Arrowhead.HOLLOW, { x: 0, y: 0 }, 10);

    const image = canvas.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/arrow-hollow.png', fileData.data);
  });

  it('should draw arrowhead filled', () => {
    ArrowHeadDrawing.canvas(ctx, Arrowhead.FILLED, { x: 0, y: 0 }, 10);

    const image = canvas.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/arrow-filled.png', fileData.data);
  });
});
