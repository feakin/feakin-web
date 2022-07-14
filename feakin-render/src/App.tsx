import React from 'react';
import './App.css';
import FkRect from "./components/FkRect";
import { Layer, Stage } from "react-konva";
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
  console.log(layout);

  return (
    <Stage width={ window.innerWidth }
           height={ window.innerHeight }
           onMouseDown={ checkDeselect }
           onTouchStart={ checkDeselect }>
      <Layer draggable>
        <FkRect
          isSelected={ selectedId == 1 }
          onSelect={ () => {
            selectShape(1);
          } }/>
      </Layer>
    </Stage>
  );
}

export default App;
