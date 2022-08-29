import { ArrowType } from "./arrow-type";
import { LineType } from "./line-type";
import { LineStyle } from "./line-style";

export const defaultEdgeDecorator: EdgeDecorator = {
  lineType: LineType.LINE,
  endType: ArrowType.NONE,
  startType: ArrowType.NONE,
  lineStyle: LineStyle.SOLID
}

export interface EdgeDecorator {
  lineStyle: LineStyle;
  lineType: LineType;
  startType: ArrowType;
  endType: ArrowType;
}
