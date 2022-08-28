import { ALIGN } from "@feakin/exporter";

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline
export enum TextBaseline {
  TOP = 'top',
  HANGING = 'hanging',
  MIDDLE = 'middle',
  ALPHABETIC = 'alphabetic',
  IDEOGRAPHIC = 'ideographic',
  BOTTOM = 'bottom',
}

export interface TextProp {
  textAlign?: ALIGN;
  textBaseline?: TextBaseline;
}
