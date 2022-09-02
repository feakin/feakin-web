import { prepareOptions } from "./marker-shape";

import { Arrowhead } from "../../../model/edge/decorator/arrowhead";
import { defaultArrowSize } from "../../../model/edge/decorator/edge-decorator";
import { defaultEdgeProperty } from "../../../model/graph";

describe('MarkerShape', () => {

  it('marker shape options', function () {
    const options = prepareOptions(defaultEdgeProperty, [{ x: 0, y: 0 }, { x: 50, y: 50 }], false, Arrowhead.FILLED);
    expect(options).toEqual({
      filled: true,
      pointEnd: {
        x: 50,
        y: 50,
      },
      size: defaultArrowSize,
      strokeWidth: 1,
      widthFactor: 2,
      unitX: 0.7071067811865475,
      unitY: 0.7071067811865475,
    });
  });

  it('option for no filled', function () {
    const options = prepareOptions(defaultEdgeProperty, [{ x: 0, y: 0 }, { x: 50, y: 50 }], false, Arrowhead.HOLLOW_CIRCLE);
    expect(options).toEqual({
      filled: false,
      pointEnd: {
        x: 50,
        y: 50,
      },
      size: defaultArrowSize,
      strokeWidth: 1,
      widthFactor: 2,
      unitX: 0.7071067811865475,
      unitY: 0.7071067811865475,
    });
  });
});
