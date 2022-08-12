import { Rectangle } from "../model/shapes/rectangle";
import { SvgShapeDrawing } from "./svg-shape-drawing";

describe('SvgShapeDrawing', () => {
  let canvas: SVGElement;
  beforeEach(function() {
    canvas = document.createElement('svg') as unknown as SVGElement;
  });

  it('rect', () => {
    let drawing = new SvgShapeDrawing(canvas as SVGElement);
    drawing.drawRect(new Rectangle(0, 0, 100, 100));

    expect(canvas.innerHTML).toBe('<rect x="0" y="0" width="100" height="100"></rect>');
  });

  it('path', () => {
    let drawing = new SvgShapeDrawing(canvas as SVGElement);
    drawing.drawPath([{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 50, y: 100 }, { x: -50, y: 100 }]);

    expect(canvas.innerHTML).toBe('<path d="M0,0 L50,50 L50,100 L-50,100" stroke="#000000" stroke-width="1" stroke-opacity="1"></path>');
  });
});
