import { generateRoughOptions, HandDrawing } from "./hand-drawing";
import { RectangleShape } from "../../model/shape";

describe('CanvasShapeDrawing', () => {
  it('hand-drawing', () => {
    const handDrawn = new HandDrawing();

    const rectangleShape = new RectangleShape(0, 0, 100, 100);
    const rectangle = handDrawn.rectangle(rectangleShape);

    const paths = handDrawn.paths(rectangle);

    expect(paths.length).toBe(1);
    expect(paths[0].stroke).toBe('#000000');
  });

  it('seed width', () => {
    const options = generateRoughOptions();
    expect(options.seed!.toString().length > 8).toBeTruthy();
  });

});
