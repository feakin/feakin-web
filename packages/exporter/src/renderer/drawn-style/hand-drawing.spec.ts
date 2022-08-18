import { generateRoughOptions, HandDrawing } from "./hand-drawing";
import { RectangleShape } from "../../model/node/rectangle-shape";

describe('CanvasShapeDrawing', () => {
  it('sample', () => {
    expect(true).toBe(true);
  })

  it('hand-drawing', () => {
    const handDrawn = new HandDrawing();

    const rectangleShape = new RectangleShape(0, 0, 100, 100);
    const rectangle = handDrawn.rectangle(rectangleShape);

    const paths = handDrawn.paths(rectangle);

    expect(paths.length).toBe(1);
    expect(paths[0].stroke).toBe('#000');
  });

  it('curve', () => {
    const handDrawn = new HandDrawing();
    const drawable = handDrawn.curve([{ x: 0, y: 0 }, { x: 100, y: 100 }]);
    const paths = handDrawn.paths(drawable);

    expect(paths.length).toBe(1);
  });

  it('path', () => {
    const handDrawn = new HandDrawing();
    const drawable = handDrawn.path([{ x: 0, y: 0 }, { x: 50, y: 60 }, { x: 100, y: 100 }]);
    const paths = handDrawn.paths(drawable);

    expect(paths.length).toBe(1);
  });

  it('line', () => {
    const handDrawn = new HandDrawing();
    const drawable = handDrawn.line({ x: 0, y: 0 }, { x: 100, y: 100 });
    const paths = handDrawn.paths(drawable);

    expect(paths.length).toBe(1);
  });

  it('seed length', () => {
    const rect = new RectangleShape(0, 0, 100, 100);
    const options = generateRoughOptions(rect);
    expect(options.seed).toBeDefined();
  });

  it('polygon', () => {
    const handDrawn = new HandDrawing();
    const drawable = handDrawn.polygon([{ x: 20, y: 20 }, { x: 100, y: 20 }, { x: 100, y: 100 }, { x: 30, y: 110}]);
    const paths = handDrawn.paths(drawable);

    console.log(paths);
    expect(paths.length).toBe(1);
  });
});
