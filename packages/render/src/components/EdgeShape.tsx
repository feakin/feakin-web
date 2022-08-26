import React from 'react';
import { Edge, flattenPoints } from "@feakin/exporter";
import { Arrow, Group, Text } from "react-konva";

function EdgeShape(edge: Edge) {
  const { points, label } = edge

  let flatPoints = flattenPoints(edge.points);

  function getLineShape() {
    return <Arrow points={ flatPoints } fill="black" stroke="black" tension={ 0.5 }/>
  }

  return <Group key={ edge.id }>
    { getLineShape() }
    <Text text={ label } x={ points[0].x } y={ points[0].y }/>
  </Group>
}

export default EdgeShape;
