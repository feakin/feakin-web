import React, { useEffect, useState } from 'react';
import { Rect, Transformer } from 'react-konva';

interface FkPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FkRectProps {
  isSelected?: boolean;
  onSelect: () => void;
  position: FkPosition
}

function FkRect(props: FkRectProps) {
  const shapeRef: any = React.useRef();
  const trRef: any = React.useRef();

  const [isDragging, setIsDragging] = useState(false);

  const [position, setPosition] = useState(props.position)

  useEffect(() => {
    if (props.isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  function onChange(param: { x: any; width: number; y: any; height: number }) {
    setPosition({
      x: param.x,
      y: param.y,
      width: param.width,
      height: param.height
    })
  }

  return (
    <React.Fragment>
      <Rect
        width={ position.width }
        height={ position.height }
        onClick={ props.onSelect }
        onTap={ props.onSelect }
        ref={ shapeRef }
        x={ position.x }
        y={ position.y }
        draggable
        // fill={ isDragging ? 'green' : 'black' }
        strokeWidth={ 1 }
        onDragStart={ () => {
          setIsDragging(true)
        } }
        onDragEnd={ (e) => {
          setIsDragging(false);
          setPosition({
            ...position,
            x: e.target.x(),
            y: e.target.y(),
          })
        } }
        onTransformEnd={ (e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        } }
      />
      { props.isSelected && (
        <Transformer
          ref={ trRef }
          boundBoxFunc={ (oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            return newBox;
          } }
        />
      ) }
    </React.Fragment>
  );

}

export default FkRect;
