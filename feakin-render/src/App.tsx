import React from 'react';
import './App.css';
import FkRect from "./components/FkRect";
import { Layer, Stage, Text } from "react-konva";

function App() {
  const [selectedId, selectShape] = React.useState(null as any);

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <Stage width={ window.innerWidth }
           height={ window.innerHeight }
           onMouseDown={ checkDeselect }
           onTouchStart={ checkDeselect }>
      <Layer>
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
