import { EdgeDecorator } from "../edge-decorator";
import { Arrowhead } from "../arrowhead";
import { LineStyle } from "../line-style";
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
          arrowSize: 6,
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NOTCHED,
        };
      case ClassRelationship.INHERITANCE:
        return {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.REALIZATION:
        return {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.DASH,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.IMPLEMENTATION:
        return {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.DASH,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW,
        };
      case ClassRelationship.DEPENDENCY:
        return {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.DASH,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NOTCHED,
        };
      case ClassRelationship.AGGREGATION:
        return {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.HOLLOW_DIAMOND,
        };
      case ClassRelationship.COMPOSITION:
        return {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.FILLED_DIAMOND,
        };
      default:
        return {
          arrowSize: 6,
          lineDashStyle: LineDashStyle.SOLID,
          lineType: LineStyle.LINE,
          startArrowhead: Arrowhead.NONE,
          endArrowhead: Arrowhead.NONE,
        }
    }
  }
}
