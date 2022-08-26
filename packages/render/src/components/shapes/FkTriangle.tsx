import React, { useState } from 'react';
import { TriangleShape } from "@feakin/exporter";
import { RegularPolygon, Text } from "react-konva";

interface FkTriangleProps {
  draggable?: boolean;
  node: any,
  shape: TriangleShape;
}

function FkTriangle(props: FkTriangleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [labelPosition] = useState(props.shape.labelPosition());
  const [position, setPosition] = useState({
    x: props.shape.x,
    y: props.shape.y
  });

  return (
    <React.Fragment>
      <RegularPolygon
        x={ props.shape.x + props.shape.width / 2}
        y={ props.shape.y }
        width={ props.shape.width }
        height={ props.shape.height }
        radius={ props.shape.width / 2 }
        sides={ 3 }
        draggable={ props.draggable || true }
        fill={ isDragging ? 'green' : '' }
        stroke={ isDragging ? 'green' : 'black' }
        strokeWidth={ 1 }
        onDragStart={ () => {
          setIsDragging(true);
        } }
        onDragEnd={ (e) => {
          setIsDragging(false);
          setPosition({
            ...position,
            x: e.target.x(),
            y: e.target.y(),
          });
        } }
      />
      { props.node.label && <Text text={ props.node.label } x={ labelPosition.x } y={ labelPosition.y }/> }
    </React.Fragment>
  );
}

export default FkTriangle;
