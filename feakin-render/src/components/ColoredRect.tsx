import React from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component {
    state = {
        color: 'green'
    };
    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    render() {
        return (
            <Rect
                x={ 20 }
                y={ 20 }
                width={ 50 }
                height={ 50 }
                fill={ this.state.color }
                shadowBlur={ 5 }
                onClick={ this.handleClick }
            />
        );
    }
}

export default ColoredRect;
