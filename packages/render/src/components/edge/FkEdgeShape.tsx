import React from 'react';
import { CanvasConnectorDrawing, defaultEdgeProperty, Edge, flattenPoints } from "@feakin/exporter";
import { Group, Line, Text } from "react-konva";
import { Drawable } from "roughjs/bin/core";
import { Context } from "konva/lib/Context";

import { RenderOptions } from "../../type";

function FkEdgeShape(props: { edge: Edge, options: RenderOptions }) {
  const { points, label, controlPoints } = props.edge
  let flatPoints = flattenPoints(props.edge.points);

  const sceneFunc = (ctx: Context) => {
    const edgeProperty = Object.assign(defaultEdgeProperty, props.edge.props!);
    CanvasConnectorDrawing.paint(ctx._context, edgeProperty, points, controlPoints);
  }

  function getLineShape() {
    if (props.options.paintStyle) {
      let drawing = props.options.paintInstance!;
      let drawable: Drawable = drawing.polygon(props.edge.points);

      return <Line
        fill={ props.edge.props?.fill?.color || 'black' }
        stroke={ props.edge.props?.stroke?.color || 'black' }
        strokeWidth={ props.edge.props?.stroke?.width || 1 }
        sceneFunc={
          (ctx) => {
            drawing.drawLine(ctx._context, drawable);
          } }
      />
    }

    return <Line
      points={ flatPoints }
      strokeWidth={ props.edge.props?.stroke?.width || 1 }
      sceneFunc={ sceneFunc }
    />
  }

  return <Group key={ props.edge.id }>
    { getLineShape() }
    { points.length > 0 && <Text text={ label } x={ points[0].x } y={ points[0].y }/> }
  </Group>
}

export default FkEdgeShape;
