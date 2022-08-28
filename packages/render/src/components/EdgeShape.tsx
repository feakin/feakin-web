import React from 'react';
import { Edge, flattenPoints } from "@feakin/exporter";
import { Arrow, Group, Text } from "react-konva";
import { RenderOptions } from "./render-options";
import { HandDrawing } from "../graph/drawn-style/hand-drawing";

function EdgeShape(edge: Edge, options: RenderOptions) {
  const { points, label } = edge

  let flatPoints = flattenPoints(edge.points);

  function getLineShape() {
    if (options.paintStyle) {
      let drawing = new HandDrawing();
      let drawable = drawing.polygon(edge.points);
      const paths = drawing.paths(drawable);
      console.log(paths);
    }

    return <Arrow points={ flatPoints } fill="black" stroke="black" tension={ 0.5 }/>
  }

  return <Group key={ edge.id }>
    { getLineShape() }
    { points.length > 0 && <Text text={ label } x={ points[0].x } y={ points[0].y }/> }
  </Group>
}

export default EdgeShape;
