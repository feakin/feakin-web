import React from 'react';
import { Edge, flattenPoints } from "@feakin/exporter";
import { Arrow, Line, Group, Text } from "react-konva";
import { Drawable } from "roughjs/bin/core";
import { RenderOptions } from './render-options';

function EdgeShape(props: { edge: Edge, options: RenderOptions }) {
  const { points, label } = props.edge

  let flatPoints = flattenPoints(props.edge.points);

  function getLineShape() {
    if (props.options.paintStyle) {
      let drawing = props.options.paintInstance!;
      let drawable: Drawable = drawing.polygon(props.edge.points);

      return <Line
        fill="black"
        stroke="black"
        sceneFunc={
          (ctx) => {
            drawing.drawLine(ctx._context, drawable);
          } }
      />
    }

    return <Arrow points={ flatPoints } fill="black" stroke="black" tension={ 0.5 }/>
  }

  return <Group key={ props.edge.id }>
    { getLineShape() }
    { points.length > 0 && <Text text={ label } x={ points[0].x } y={ points[0].y }/> }
  </Group>
}

export default EdgeShape;
