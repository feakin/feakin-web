import { EdgeDecorator } from "../edge-decorator";
import { Arrowhead } from "../arrowhead";
import { LineType } from "../line-type";
import { LineStyle } from "../line-style";

/**
 * @enum { import("../arrowhead.ts").Arrowhead }
 * @enum { import("../line-style").LineStyle }
 */
export enum ClassRelationship {
  NONE = 'none',
  /**
   *  @type {LineStyle.SOLID}
   *  @type {Arrowhead.NOTCHED}
   *  ─────>
   */
  ASSOCIATION = 'association',
  /**
   * @type {LineStyle.SOLID}
   * @type {Arrowhead.HOLLOW}
   * ─────▷
   */
  INHERITANCE = 'inheritance',
  /**
   * @type {LineStyle.DASH}
   * @type {Arrowhead.HOLLOW}
   * -----▷
   */
  REALIZATION = 'realization',
  /**
   * @type {LineStyle.DASH}
   * @type {Arrowhead.HOLLOW}
   * -----▷
   */
  IMPLEMENTATION = 'implementation',
  /**
   * @type {LineStyle.DASH}
   * @typedef {Arrowhead.NOTCHED}
   * ----->
   */
  DEPENDENCY = 'dependency',
  /**
   * @type {LineStyle.DASH}
   * @type {Arrowhead.HOLLOW_DIAMOND}
   * ─────◇
   */
  AGGREGATION = 'aggregation',
  /**
   * @type {LineStyle.DASH}
   * @type {Arrowhead.FILLED_DIAMOND}
   * ─────◆
   */
  COMPOSITION = 'composition',
}

export class ClassRelationshipsImpl {
  static relationToLineStyle(type: ClassRelationship): EdgeDecorator {
    switch (type) {
      case ClassRelationship.ASSOCIATION:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NOTCHED,
        };
      case ClassRelationship.INHERITANCE:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.REALIZATION:
        return {
          lineStyle: LineStyle.DASH,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.IMPLEMENTATION:
        return {
          lineStyle: LineStyle.DASH,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.DEPENDENCY:
        return {
          lineStyle: LineStyle.DASH,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NOTCHED,
        };
      case ClassRelationship.AGGREGATION:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW_DIAMOND,
        };
      case ClassRelationship.COMPOSITION:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.FILLED_DIAMOND,
        };
      default:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NONE,
        }
    }
  }
}
