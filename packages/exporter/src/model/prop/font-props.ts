// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
import { ALIGN } from "./style-constants";

export interface FontProps {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontColor?: string;
  direction?: string;
  textAlign?: ALIGN;
}

export class FontImpl implements FontProps {
  fontSize = 12;

  // specs: https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-font-dev
  fromString() {
    //
  }

  toCanvasString() {
    //
  }
}
