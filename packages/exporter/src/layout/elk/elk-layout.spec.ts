import { ElkLayout } from "./elk-layout";

describe('ElkLayout', () => {
  it('layout', async () => {
    const elkLayout = new ElkLayout();
    let layout = elkLayout.layout([]);
    console.log(layout);
  });
});
