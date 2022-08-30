import { LineStyle, LineStyleImpl } from "./line-style";

describe('LineStyle', () => {
  it('SOLID', () => {
    const output = LineStyleImpl.createForTestOnly(LineStyle.SOLID, 2);
    expect(output).toBe('');
  });

  it('DASH', () => {
    const output = LineStyleImpl.createForTestOnly(LineStyle.DASH, 2);
    expect(output).toBe('--·');
  });

  it('DOT', () => {
    const output = LineStyleImpl.createForTestOnly(LineStyle.DOT, 2);
    expect(output).toBe('·-');
  });

  it('DOT_DASH', () => {
    const output = LineStyleImpl.createForTestOnly(LineStyle.DOT_DASH, 2);
    expect(output).toBe('·-----');
  });

  it('LONG_DASH', () => {
    const output = LineStyleImpl.createForTestOnly(LineStyle.LONG_DASH, 2);
    expect(output).toBe('---·');
  });
});
