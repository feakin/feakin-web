import { Executor } from "./executor";

describe('Executor', () => {
  it('sample', () => {
    const executor = new Executor();
    const source = `graph TD;
    A-->B
    B-->C;`;
    const result = executor.execute(source);
    console.log((result));
  });
});
