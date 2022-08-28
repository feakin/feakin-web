import React, { useState } from 'react';
import { flattenPoints, Node, PolygonShape } from "@feakin/exporter";
import { Line, Text } from "react-konva";

interface FkPolygonShapeProps {
  draggable?: boolean;
  node: Node,
  shape: PolygonShape;
}

function FkPolygonShape(props: FkPolygonShapeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [labelPosition] = useState(props.shape.labelPosition());
  const [position, setPosition] = useState({
    x: props.shape.x,
    y: props.shape.y
  });

  // draw the triangle as a line, it is easier to keep polygon shape in same rules.
  return (
    <React.Fragment>
      <Line
        x={ props.shape.x }
        y={ props.shape.y }
        points={ flattenPoints(props.shape.points()) }
        draggable={ props.draggable || true }
        fill={ props.node.prop?.fill?.color || '#fff' }
        stroke={ isDragging ? 'green' : 'black' }
        strokeWidth={ 1 }
        onDragStart={ () => {
          setIsDragging(true);
        } }
        closed
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

export default FkPolygonShape;
