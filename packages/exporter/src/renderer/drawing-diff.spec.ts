import { SvgShapeDrawing } from "./svg/svg-shape-drawing";

describe('DrawingDiff', () => {
  let svg: SVGElement;
  let canvas: any, ctx: any;

  beforeEach(function () {
    svg = document.createElement('svg') as unknown as SVGElement;

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
  });

  it('diff svg and canvas', async () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawPath([{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 50, y: 100 }, { x: -50, y: 100 }]);
  });
});
