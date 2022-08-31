import React from 'react';
import { defaultEdgeProperty, Edge, flattenPoints } from "@feakin/exporter";
import { Group, Line, Text } from "react-konva";
import { Drawable } from "roughjs/bin/core";
import { RenderOptions } from "../type";
import { ConnectorDrawing } from "@feakin/exporter/src/renderer/edge/connector-drawing";
import { Context } from "konva/lib/Context";

function EdgeShape(props: { edge: Edge, options: RenderOptions }) {
  const { points, label } = props.edge
  // todo: add default decorator
  let flatPoints = flattenPoints(props.edge.points);

  const sceneFunc = (ctx: Context) => {
    const edgeProperty = Object.assign(defaultEdgeProperty, props.edge.props!);
    ConnectorDrawing.render(ctx._context, edgeProperty, points);
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

export default EdgeShape;
