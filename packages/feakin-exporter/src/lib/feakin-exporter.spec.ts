import { dagreLayout, feakinExporter } from './feakin-exporter';

describe('feakinExporter', () => {
  it('should work', () => {
    expect(feakinExporter()).toEqual('feakin-exporter');
  });

  it('layout', () => {
    dagreLayout();
  });
});
