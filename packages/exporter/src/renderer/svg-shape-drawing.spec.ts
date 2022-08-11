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
});
