import { EdgeDecorator } from "../../model/edge/decorator/edge-decorator";
import { ArrowType } from "../../model/edge/decorator/arrow-type";
import { LineType } from "../../model/edge/decorator/line-type";
import { LineStyle } from "../../model/edge/decorator/line-style";

/**
 * @enum { import("../../model/edge/decorator/arrow-type").ArrowType }
 * @enum { import("../../model/edge/decorator/line-style").LineStyle }
 */
export enum ClassRelationship {
  NONE = 'none',
  /**
   *  @type {LineStyle.SOLID}
   *  @type {ArrowType.NOTCHED}
   *  ─────>
   */
  ASSOCIATION = 'association',
  /**
   * @type {LineStyle.SOLID}
   * @type {ArrowType.HOLLOW}
   * ─────▷
   */
  INHERITANCE = 'inheritance',
  /**
   * @type {LineStyle.DASH}
   * @type {ArrowType.HOLLOW}
   * -----▷
   */
  REALIZATION = 'realization',
  /**
   * @type {LineStyle.DASH}
   * @type {ArrowType.HOLLOW}
   * -----▷
   */
  IMPLEMENTATION = 'implementation',
  /**
   * @type {LineStyle.DASH}
   * @type {ArrowType.NOTCHED}
   * ----->
   */
  DEPENDENCY = 'dependency',
  /**
   * @type {LineStyle.DASH}
   * @type {ArrowType.HOLLOW_DIAMOND}
   * ─────◇
   */
  AGGREGATION = 'aggregation',
  /**
   * @type {LineStyle.DASH}
   * @type {ArrowType.FILLED_DIAMOND}
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
          startType: ArrowType.NONE,
          endType: ArrowType.NOTCHED,
        };
      case ClassRelationship.INHERITANCE:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startType: ArrowType.NONE,
          endType: ArrowType.HOLLOW,
        };
      case ClassRelationship.REALIZATION:
        return {
          lineStyle: LineStyle.DASH,
          lineType: LineType.LINE,
          startType: ArrowType.NONE,
          endType: ArrowType.HOLLOW,
        };
      case ClassRelationship.IMPLEMENTATION:
        return {
          lineStyle: LineStyle.DASH,
          lineType: LineType.LINE,
          startType: ArrowType.NONE,
          endType: ArrowType.HOLLOW,
        };
      case ClassRelationship.DEPENDENCY:
        return {
          lineStyle: LineStyle.DASH,
          lineType: LineType.LINE,
          startType: ArrowType.NONE,
          endType: ArrowType.NOTCHED,
        };
      case ClassRelationship.AGGREGATION:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startType: ArrowType.NONE,
          endType: ArrowType.HOLLOW_DIAMOND,
        };
      case ClassRelationship.COMPOSITION:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startType: ArrowType.NONE,
          endType: ArrowType.FILLED_DIAMOND,
        };
      default:
        return {
          lineStyle: LineStyle.SOLID,
          lineType: LineType.LINE,
          startType: ArrowType.NONE,
          endType: ArrowType.NONE,
        }
    }
  }
}
