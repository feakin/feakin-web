import React from 'react';
import { render } from '@testing-library/react';
import FkRect from "./FkRect";

function getTextWidthWithFontSize(text: string, fontSize: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = `${ fontSize }px Arial`;
  return context.measureText(text).width;
}

test('render text size', () => {
  let fontSize = getTextWidthWithFontSize('Hello', 10);
  expect(fontSize).toBe(23);
});

test('render FkRect', () => {
  render(<FkRect position={ {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  } } node={{} as any}/>);
});
