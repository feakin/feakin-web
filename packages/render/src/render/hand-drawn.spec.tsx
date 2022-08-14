import { HandDrawn } from "./hand-drawn";

test('hand-drawn', () => {
  let handDrawn = new HandDrawn();
  let rectangle = handDrawn.rectangle();
  console.log(rectangle);
});
