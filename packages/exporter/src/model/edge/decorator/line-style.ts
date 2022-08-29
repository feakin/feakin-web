export enum LineStyle {
  // ──────
  SOLID = 'solid',
  // ······
  DOT = 'dot',
  // ------
  DASH = 'dash',
  // ─·─·─·─
  DOT_DASH = 'dot-dash',
  // ─ ─ ─ ─
  LONG_DASH = 'long-dash',
  // ──·──·──·──·──·
  LONG_DASH_DOT = 'long-dash-dot',
  // -·-·-·-
  SOLID_DASH_DOT = 'solid-dash-dot',
  // - - - -
  SHORT_DASH = 'short-dash',
}

export class LineStyleImpl {
  static create(style: LineStyle, strokeWidth: number): string {
    switch (style) {
      case LineStyle.DASH:
        return `${ strokeWidth } ${ strokeWidth * 2 }`;
      case LineStyle.DOT:
        return `${ strokeWidth } ${ strokeWidth * 2 }`;
      case LineStyle.DOT_DASH:
        return `${ strokeWidth } ${ strokeWidth * 2 } ${ strokeWidth } ${ strokeWidth * 2 }`;
      case LineStyle.LONG_DASH:
        return `${ strokeWidth } ${ strokeWidth * 4 }`;
      case LineStyle.LONG_DASH_DOT:
        return `${ strokeWidth } ${ strokeWidth * 4 } ${ strokeWidth } ${ strokeWidth * 2 }`;
      case LineStyle.SOLID_DASH_DOT:
        return `${ strokeWidth } ${ strokeWidth * 2 } ${ strokeWidth } ${ strokeWidth * 2 }`;
      case LineStyle.SHORT_DASH:
        return `${ strokeWidth } ${ strokeWidth * 2 }`;
      default:
        return '';
    }
  }
}
