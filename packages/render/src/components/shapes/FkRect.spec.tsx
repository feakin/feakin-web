import React from 'react';
import { render } from '@testing-library/react';
import FkRect from "./FkRect";

// test('render FkRect', () => {
//   const rectangle = new RectangleShape(0, 0, 100, 60);
//   render(<FkRect shape={ rectangle } node={{} as any}/>);
// });

test('render FkRect', () => {
  render(<FkRect shape={ {
    center: () => {
      return { x: 0, y: 0 }
    },
  } as any } node={ {} as any }/>);
});
