import React from 'react';
import { Edge, flattenPoints, LineStyle, LineStyleImpl } from "@feakin/exporter";
import { Arrow, Group, Line, Text } from "react-konva";
import { Drawable } from "roughjs/bin/core";
import { RenderOptions } from "../type";

function dashFromDecorator(lineStyle: LineStyle): number[] {
  return LineStyleImpl.toDashPattern(lineStyle, 5);
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

    let dash = props.edge.props?.decorator?.lineStyle ? dashFromDecorator(props.edge.props!.decorator.lineStyle) : [];

    return <Arrow
      dash={ dash }
      lineCap={ "round" }
      points={ flatPoints }
      fill={ props.edge.props?.fill?.color || 'black' }
      stroke={ props.edge.props?.stroke?.color || 'black' }
      strokeWidth={ props.edge.props?.stroke?.width || 1 }
      tension={ 0.5 }
      // sceneFunc={
      //   (ctx) => {
      //     drawArrowhead(ctx._context, { x: flatPoints[0], y: flatPoints[1] } as Point, decorator?.startArrowhead);
      //   } }
    />
  }

  return <Group key={ props.edge.id }>
    { getLineShape() }
    { points.length > 0 && <Text text={ label } x={ points[0].x } y={ points[0].y }/> }
  </Group>
}

export default EdgeShape;
