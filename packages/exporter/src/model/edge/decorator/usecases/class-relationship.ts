import { EdgeDecorator } from "../edge-decorator";
import { Arrowhead } from "../arrowhead";
import { LineType } from "../line-type";
import { LineDashStyle } from "../line-dash-style";

/**
 * @enum { import("../arrowhead.ts").Arrowhead }
 * @enum { import("../line-dash-style.ts").LineDashStyle }
 */
export enum ClassRelationship {
  NONE = 'none',
  /**
   *  @type {LineDashStyle.SOLID}
   *  @type {Arrowhead.NOTCHED}
   *  ─────>
   */
  ASSOCIATION = 'association',
  /**
   * @type {LineDashStyle.SOLID}
   * @type {Arrowhead.HOLLOW}
   * ─────▷
   */
  INHERITANCE = 'inheritance',
  /**
   * @type {LineDashStyle.DASH}
   * @type {Arrowhead.HOLLOW}
   * -----▷
   */
  REALIZATION = 'realization',
  /**
   * @type {LineDashStyle.DASH}
   * @type {Arrowhead.HOLLOW}
   * -----▷
   */
  IMPLEMENTATION = 'implementation',
  /**
   * @type {LineDashStyle.DASH}
   * @typedef {Arrowhead.NOTCHED}
   * ----->
   */
  DEPENDENCY = 'dependency',
  /**
   * @type {LineDashStyle.DASH}
   * @type {Arrowhead.HOLLOW_DIAMOND}
   * ─────◇
   */
  AGGREGATION = 'aggregation',
  /**
   * @type {LineDashStyle.DASH}
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
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NOTCHED,
        };
      case ClassRelationship.INHERITANCE:
        return {
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.REALIZATION:
        return {
          lineDashStyle: LineDashStyle.DASH,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.IMPLEMENTATION:
        return {
          lineDashStyle: LineDashStyle.DASH,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.DEPENDENCY:
        return {
          lineDashStyle: LineDashStyle.DASH,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NOTCHED,
        };
      case ClassRelationship.AGGREGATION:
        return {
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW_DIAMOND,
        };
      case ClassRelationship.COMPOSITION:
        return {
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.FILLED_DIAMOND,
        };
      default:
        return {
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineType.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NONE,
        }
    }
  }
}
