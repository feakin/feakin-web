import { Executor } from "./executor";

describe('execute', () => {
  it('sample', () => {
    const executor = new Executor();
    const source = `graph TD;
    A-->B
    B-->C;`;
    const result = executor.execute(source);
    // expect(result).toBe(source);
  });
});
