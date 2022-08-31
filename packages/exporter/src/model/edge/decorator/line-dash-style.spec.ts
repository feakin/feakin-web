import { LineDashStyle, LineDashStyleImpl } from "./line-dash-style";

describe('LineDashStyle', () => {
  it('SOLID', () => {
    const output = LineDashStyleImpl.createForTestOnly(LineDashStyle.SOLID, 2);
    expect(output).toBe('');
  });

  it('DASH', () => {
    const output = LineDashStyleImpl.createForTestOnly(LineDashStyle.DASH, 2);
    expect(output).toBe('=-');
  });

  it('DOT', () => {
    const output = LineDashStyleImpl.createForTestOnly(LineDashStyle.DOT, 2);
    expect(output).toBe('--');
  });

  it('DOT_DASH', () => {
    const output = LineDashStyleImpl.createForTestOnly(LineDashStyle.DOT_DASH, 2);
    expect(output).toBe('=---');
  });

  it('LONG_DASH', () => {
    const output = LineDashStyleImpl.createForTestOnly(LineDashStyle.LONG_DASH, 2);
    expect(output).toBe('#-');
  });

  it('LONG_DASH_DOT', () => {
    const output = LineDashStyleImpl.createForTestOnly(LineDashStyle.LONG_DASH_DOT, 2);
    expect(output).toBe('#---');
  });
});
