import { CanvasShapeDrawing} from './canvas-shape-drawing';
import { Rectangle } from "../model/shapes/rectangle";
import 'jest-canvas-mock';

describe('CanvasShapeDrawing', () => {
  let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;
  beforeEach(function() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')!;
  });

  it('rect', () => {
    console.log(ctx);
    let drawing = new CanvasShapeDrawing(ctx);
    drawing.drawRect(new Rectangle(0, 0, 100, 100));
    let canvasElement = drawing.ctx.canvas;

    // @ts-ignore
    console.log(drawing.ctx.__getEvents())
    console.log(canvasElement.toDataURL());
  });
});
