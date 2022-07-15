import React, { useLayoutEffect, useRef } from 'react';
import './App.css';
import FkRect from "./components/FkRect";
import { Arrow, Group, KonvaNodeComponent, Layer, Line, Stage, StageProps, Text } from "react-konva";
import { fkDagre, NodeDefinition } from "./layout/fk-dagre";
import Konva from "konva";
import StageConfig = Konva.StageConfig;

export const nodeDefinitions: NodeDefinition[] = [
  {
    id: "kspacey",
    definition: { label: "Kevin Spacey", width: 144, height: 100 }
  },
  {
    id: "swilliams",
    definition: { label: "Saul Williams", width: 160, height: 100 }
  },
  { id: "bpitt", definition: { label: "Brad Pitt", width: 108, height: 100 } },
  {
    id: "hford",
    definition: { label: "Harrison Ford", width: 168, height: 100 }
  },
  {
    id: "lwilson",
    definition: { label: "Luke Wilson", width: 144, height: 100 }
  },
  {
    id: "kbacon",
    definition: { label: "Kevin Bacon", width: 121, height: 100 }
  }
];

export const edges = [
  ["kspacey", "swilliams"],
  ["swilliams", "kbacon"],
  ["kbacon", "kspacey"]
];

function App() {
  const [selectedId, selectShape] = React.useState<number | null>(null);
  const stageEl = useRef<Konva.Stage | null>(null);
  const layerEl = useRef<Konva.Layer | null>(null);
  const [lines, setLines] = React.useState([] as any);
  const isDrawing = React.useRef(false);

  useLayoutEffect(() => {
    if (stageEl.current != null) {

    }
  })

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);

      // for draw items ?
      onMouseDown(e);
    }
  };

  // refs: https://jsbin.com/rumizocise/1/edit?html,js,output
  const onMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = false;
  }


  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    // @ts-ignore
    const pos = e.target.getStage().getPointerPosition();
    // @ts-ignore
    setLines([...lines, [pos.x, pos.y]]);
  }

  const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

    const stage: Konva.Stage = e.target.getStage()!!;
    const point = stage.getPointerPosition()!!;
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  }

  const onMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {

  }

  const layout = fkDagre(nodeDefinitions, edges);

  // todo: add redo and undo functionality
  return (
    <Stage ref={ stageEl }
           width={ window.innerWidth }
           height={ window.innerHeight }
           onMouseDown={ checkDeselect }
           onMouseUp={ onMouseUp }
           onMouseMove={ onMouseMove }
           onMouseOut={ onMouseOut }
           onTouchStart={ checkDeselect }>

      <Layer ref={ layerEl } draggable>
        {
          layout.nodes.map((node: any, index: number) => {
            return (
              <FkRect
                key={ "node_" + index }
                isSelected={ false }
                draggable={ false }
                onSelect={ () => {

                } }
                // todo: add location converter
                position={ {
                  x: node.x - node.width / 2,
                  y: node.y - node.height / 2,
                  width: node.width,
                  height: node.height
                } }></FkRect>
            )
          })
        }
        { layout.edges.map((edge) => {
          const { points, label } = edge.props;
          return (
            <Group key={ edge.props.label }>
              <Arrow
                points={ edge.points }
                fill="black"
                stroke="black"
              />
              <Text text={ label } x={ points[0].x } y={ points[0].y }/>
            </Group>
          );
        }) }

        { lines.map((line: number[] | undefined, i: React.Key | null | undefined) => (
          <Line key={ i } points={ line } stroke="red"/>
        )) }

        <FkRect
          isSelected={ selectedId == 1 }
          onSelect={ () => {
            selectShape(1);
          } } position={ {
          x: 20,
          y: 20,
          width: 50,
          height: 50
        } }/>
      </Layer>
    </Stage>
  );
}

export default App;
