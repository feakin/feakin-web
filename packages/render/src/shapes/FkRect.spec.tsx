import React from 'react';

function getTextWidthWithFontSize(text: string, fontSize: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = `${fontSize}px Arial`;
  return context.measureText(text).width;
}

test('renders learn react link', () => {
  // render(<FkRect position={ {
  //   x: 0,
  //   y: 0,
  //   width: 100,
  //   height: 100,
  // }
  // }/>);


  let fontSize = getTextWidthWithFontSize('Hello', 10);
  expect(fontSize).toBe(23);
});
