import { flow } from './mermaid-flow';

describe('feakinExporter', () => {
  it('should work', () => {
    let flow1 = flow(`graph TD;
    A-->B;`);

    console.log(flow1);
  });
});
