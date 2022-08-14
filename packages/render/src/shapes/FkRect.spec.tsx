import React from 'react';
import { render } from '@testing-library/react';
import FkRect from "./FkRect";

test('render FkRect', () => {
  render(<FkRect position={ {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  } } node={{} as any}/>);
});
