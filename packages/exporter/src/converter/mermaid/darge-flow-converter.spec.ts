import { DargeFlowConverter } from "./darge-flow-converter";

describe('DagreFlowConverter', () => {
  it('sample', () => {
    const executor = new DargeFlowConverter();
    const source = `graph TD;
    A-->B
    B-->C;`;
    const result = executor.sourceToDagre(source);
    expect(result.nodes.length).toBe(3);
  });
});
