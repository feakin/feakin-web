import React from 'react';
import './App.css';
import ColoredRect from "./components/ColoredRect";
import { Layer, Stage, Text } from "react-konva";

function App() {
    return (
        <Stage width={ window.innerWidth } height={ window.innerHeight }>
            <Layer>
                <Text text="Try click on rect"/>
                <ColoredRect/>
            </Layer>
        </Stage>
    );
}

export default App;
