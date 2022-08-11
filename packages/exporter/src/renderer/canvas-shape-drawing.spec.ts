import { CanvasShapeDrawing } from './canvas-shape-drawing';
import { Rectangle } from "../model/shapes/rectangle";
import { dataURLtoFileData } from "./utils/image";
import * as fs from "fs";

describe('CanvasShapeDrawing', () => {
  let canvas: any, ctx: any;
  beforeEach(function () {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    if (!fs.existsSync("test")) {
      fs.mkdirSync('test');
    }
  });

  it('rect', () => {
    let drawing = new CanvasShapeDrawing(ctx);
    drawing.drawRect(new Rectangle(0, 0, 100, 100));
    let canvasElement = drawing.ctx.canvas;

    let image = canvasElement.toDataURL();
    let fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/rect.png', fileData.data);
  });
});
