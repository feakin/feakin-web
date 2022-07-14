import React from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component {
  state = {
    color: 'green',
    isDragging: false,
    x: 20,
    y: 20
  };

  handleClick = () => {

  };

  render() {
    return (
      <Rect
        width={ 50 }
        height={ 50 }
        shadowBlur={ 5 }
        onClick={ this.handleClick }
        x={ this.state.x }
        y={ this.state.y }
        draggable
        fill={ this.state.isDragging ? 'green' : 'black' }
        onDragStart={ () => {
          this.setState({
            isDragging: true,
          });
        } }
        onDragEnd={ (e) => {
          this.setState({
            isDragging: false,
            x: e.target.x(),
            y: e.target.y(),
          });
        } }
      />
    );
  }
}

export default ColoredRect;
