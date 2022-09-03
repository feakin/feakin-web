import React, { MutableRefObject, useEffect, useState } from 'react';
import { Rect, Text, Transformer } from 'react-konva';
import Konva from "konva";
import { Node, RectangleShape, ShapeType } from "@feakin/exporter";

interface FkRectConfig {
}

interface FkRectProps {
  node: Node,
  draggable?: boolean;
  isSelected?: boolean;
  onSelect?: (ref: MutableRefObject<Konva.Rect | null>) => void;
  shape: RectangleShape;
  config?: FkRectConfig;
}

export const FK_RECT_NAME = '.fk-rect';

function FkRect(props: FkRectProps) {
  const shapeRef = React.useRef<Konva.Rect | null>(null);
  const trRef: any = React.useRef<Konva.Transformer | null>(null);

  const [labelPosition] = useState(props.shape.center());
  const [, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: props.shape.x,
    y: props.shape.y
  });

  useEffect(() => {
    if (props.isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  function onChange(param: any) {
    setPosition({
      x: param.x,
      y: param.y,
    });
  }

  return (
    <React.Fragment>
      <Rect
        name="fk-rect"
        x={ props.shape.x }
        y={ props.shape.y }
        width={ props.shape.width }
        height={ props.shape.height }
        onClick={ () => props.onSelect && props.onSelect(shapeRef) }
        onTap={ () => props.onSelect && props.onSelect(shapeRef) }
        ref={ shapeRef }
        draggable={ props.draggable || true }
        fill={ props.node.props?.fill?.color || '#fff' }
        stroke={ props.node.props?.stroke?.color || '#000' }
        strokeWidth={ props.node.data?.shape === ShapeType.Text ? 0 : 1 }
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
        onTransformEnd={ (e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current!!;
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
      { props.node.label && <Text
        text={ props.node.label }
        // fillAfterStrokeEnabled={ true }
        // todo: add font color supporth
        // fill={ props.node.props?.stroke?.color || '#000' }
        x={ labelPosition.x }
        y={ labelPosition.y }/>
      }
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
