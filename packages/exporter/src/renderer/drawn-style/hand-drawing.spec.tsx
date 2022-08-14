import { HandDrawing } from "./hand-drawing";

test('hand-drawing', () => {
  const handDrawn = new HandDrawing();
  const rectangle = handDrawn.rectangle();
  const paths = handDrawn.paths(rectangle);
  console.log(paths);
});
