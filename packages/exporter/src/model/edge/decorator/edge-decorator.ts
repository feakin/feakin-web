import { Arrowhead } from "./arrowhead";
import { LineType } from "./line-type";
import { LineDashStyle } from "./line-dash-style";

export const defaultEdgeDecorator: EdgeDecorator = {
  arrowSize: 6,
  lineType: LineType.LINE,
  lineDashStyle: LineDashStyle.SOLID,
  endArrowhead: Arrowhead.NONE,
  startArrowhead: Arrowhead.NONE,
}

export const defaultArrowSize = 6;

/**
 * The edge decorator is used to specify the style of the line and arrowheads
 */
export interface EdgeDecorator {
  arrowSize: number;
  lineDashStyle: LineDashStyle;
  lineType: LineType;
  startArrowhead: Arrowhead;
  endArrowhead: Arrowhead;
}

/**
 * this function is to make clearly about each type arrow and line for understand, especially for the test.
 */
export function edgeDecoratorForTest(edgeDecorator: EdgeDecorator): string {
  let result = "";
  switch (edgeDecorator.startArrowhead) {
    case Arrowhead.NONE:
      result += "";
      break;
    case Arrowhead.NOTCHED:
      result += "<";
      break;
    case Arrowhead.HOLLOW:
      result += "◁";
      break;
    case Arrowhead.HOLLOW_CIRCLE:
      result += "○";
      break;
    case Arrowhead.HOLLOW_SQUARE:
      result += "□";
      break;
    case Arrowhead.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case Arrowhead.FILLED:
      result += "◀";
      break;
    case Arrowhead.FILLED_CIRCLE:
      result += "●";
      break;
    case Arrowhead.FILLED_SQUARE:
      result += "■";
      break;
    case Arrowhead.FILLED_DIAMOND:
      result += "◆";
      break;
  }

  const lineRepeat = 5;
  switch (edgeDecorator.lineDashStyle) {
    case LineDashStyle.SOLID:
      result += "─".repeat(lineRepeat);
      break;
    case LineDashStyle.DASH:
      result += "-".repeat(lineRepeat);
      break;
    case LineDashStyle.DOT:
      result += ".".repeat(lineRepeat);
      break;
    default:
      result += " ".repeat(lineRepeat);
  }

  switch (edgeDecorator.endArrowhead) {
    case Arrowhead.NONE:
      result += "";
      break;
    case Arrowhead.NOTCHED:
      result += ">";
      break;
    case Arrowhead.HOLLOW:
      result += "▷";
      break;
    case Arrowhead.HOLLOW_CIRCLE:
      result += "○";
      break;
    case Arrowhead.HOLLOW_SQUARE:
      result += "□";
      break;
    case Arrowhead.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case Arrowhead.FILLED:
      result += "▶";
      break;
    case Arrowhead.FILLED_CIRCLE:
      result += "●";
      break;
    case Arrowhead.FILLED_SQUARE:
      result += "■";
      break;
    case Arrowhead.FILLED_DIAMOND:
      result += "◆";
      break;
  }

  return result;
}
