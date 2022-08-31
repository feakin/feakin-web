import React from 'react';
import { defaultEdgeProperty, Edge, EdgeProperty, flattenPoints } from "@feakin/exporter";
import { Group, Line, Text } from "react-konva";
import { Drawable } from "roughjs/bin/core";
import { RenderOptions } from "../type";
import { ConnectorDrawing } from "@feakin/exporter/src/renderer/edge/connector-drawing";

function mergeProp(edgeProperty: EdgeProperty): EdgeProperty {
  return Object.assign({}, defaultEdgeProperty, edgeProperty);
}

function EdgeShape(props: { edge: Edge, options: RenderOptions }) {
  const { points, label } = props.edge
  // todo: add default decorator
  let flatPoints = flattenPoints(props.edge.points);

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
      sceneFunc={
        (ctx) => {
          ConnectorDrawing.render(ctx._context, mergeProp(props.edge.props!), points);
        } }
    />
  }

  return <Group key={ props.edge.id }>
    { getLineShape() }
    { points.length > 0 && <Text text={ label } x={ points[0].x } y={ points[0].y }/> }
  </Group>
}

export default EdgeShape;
