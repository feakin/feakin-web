import React, { useState } from 'react';
import { EllipseShape, Node } from "@feakin/exporter";
import { Ellipse, Text } from "react-konva";

interface FkEllipseShapeProps {
  draggable?: boolean;
  node: Node,
  shape: EllipseShape;
}

function FkEllipseShape(props: FkEllipseShapeProps) {
  const [position] = useState({
    x: props.shape.x,
    y: props.shape.y
  });
  const labelPosition = props.shape.labelPosition();

  return (
    <React.Fragment>
      <Ellipse
        x={ position.x }
        y={ position.y }
        radiusX={ props.shape.width }
        radiusY={ props.shape.height }
        fill={ props.node.props?.fill?.color || '#fff' }
        stroke={ props.node.props?.stroke?.color || '#000' }
        strokeWidth={ 1 }/>

      { props.node.label && <Text text={ props.node.label } x={ labelPosition.x } y={ labelPosition.y }/> }
    </React.Fragment>
  );
}

export default FkEllipseShape;
