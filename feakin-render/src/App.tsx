import React from 'react';
import './App.css';
import FkRect from "./components/FkRect";
import { Arrow, Group, Layer, Stage, Text } from "react-konva";
import { fkDagre, NodeDefinition } from "./layout/fk-dagre";

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
  const [selectedId, selectShape] = React.useState(null as any);

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const layout = fkDagre(nodeDefinitions, edges);

  return (
    <Stage width={ window.innerWidth }
           height={ window.innerHeight }
           onMouseDown={ checkDeselect }
           onTouchStart={ checkDeselect }>
      <Layer draggable>
        {
          layout.nodes.map((node: any) => {
            return (
              <FkRect
                isSelected
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
