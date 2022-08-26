import React from 'react';
import { Edge, flattenPoints } from "@feakin/exporter";
import { Arrow, Line, Group, Text } from "react-konva";

const START_END_POINTS_LEN = 6;

function EdgeShape(edge: Edge) {
  const { points, label } = edge

  let flatPoints = flattenPoints(edge.points);

  function getLineShape() {
    if (flatPoints.length > START_END_POINTS_LEN) {
      return <Line points={ flatPoints } fill="black" stroke="black" bezier/>
    } else {
      return <Arrow points={ flatPoints } fill="black" stroke="black"/>
    }
  }

  return <Group key={ edge.id }>
    { getLineShape() }
    <Text text={ label } x={ points[0].x } y={ points[0].y }/>
  </Group>
}

export default EdgeShape;
