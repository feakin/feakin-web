import { getTextWidthWithFontSize } from "./text-helper";

test('render text size', () => {
  let fontSize = getTextWidthWithFontSize('Hello', 10);
  expect(fontSize).toBe(23);
});
