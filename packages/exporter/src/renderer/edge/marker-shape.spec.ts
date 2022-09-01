import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { defaultEdgeProperty } from "../../model/graph";
import { prepareOptions } from "./marker-shape";

describe('MarkerShape', () => {

  it('marker shape options', function () {
    const options = prepareOptions(defaultEdgeProperty, [{ x: 0, y: 0 }, { x: 50, y: 50 }], false, Arrowhead.FILLED);
    expect(options).toEqual({
      filled: true,
      pointEnd: {
        x: 50,
        y: 50,
      },
      size: 6,
      strokeWidth: 1,
      widthFactor: 2,
      unitX: 0.7071067811865475,
      unitY: 0.7071067811865475,
    });
  });
});
