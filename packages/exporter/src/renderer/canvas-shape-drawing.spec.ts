import * as fs from "fs";
import { CanvasShapeDrawing } from './canvas-shape-drawing';
import { dataURLtoFileData } from "./utils/data-url";
import { CircleShape, HexagonShape, RectangleShape } from "../model/shape";

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
    const drawing = new CanvasShapeDrawing(ctx);
    drawing.drawRect(new RectangleShape(0, 0, 100, 100));
    const canvasElement = drawing.ctx.canvas;

    const image = canvasElement.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/rect.png', fileData.data);
  });

  it('path', () => {
    const drawing = new CanvasShapeDrawing(ctx);
    drawing.drawPath([{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 50, y: 100 }, { x: -50, y: 100 }]);

    const canvasElement = drawing.ctx.canvas;

    const image = canvasElement.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/path.png', fileData.data);
  });

  it('circle', () => {
    const drawing = new CanvasShapeDrawing(ctx);
    drawing.drawCircle(new CircleShape(60, 60, 50));

    const canvasElement = drawing.ctx.canvas;

    const image = canvasElement.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/circle.png', fileData.data);
  });

  it('hexagon', () => {
    const drawing = new CanvasShapeDrawing(ctx);
    drawing.drawHexagon(new HexagonShape(1, 1, 60, 60));

    const canvasElement = drawing.ctx.canvas;

    const image = canvasElement.toDataURL();
    const fileData = dataURLtoFileData(image);

    fs.writeFileSync('./test/hexagon.png', fileData.data);
  });
});
