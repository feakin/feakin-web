import { greeter } from '../src/main.js';

describe('greeter function', () => {
  const name = 'John';

  it('greets a user with `Hello, {name}` message', () => {
    expect(greeter(name)).toBe(`Hello, ${name}`);
  });
});
