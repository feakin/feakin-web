import { flow } from './mermaid-flow';

describe('feakinExporter', () => {
  it('should work', () => {
    flow("graph TD; A-->B;");
  });
});
