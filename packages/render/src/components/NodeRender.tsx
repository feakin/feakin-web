import React from 'react';
import { Node, ElementProperty, RectangleShape } from "@feakin/exporter";
import FkRect from "./shapes/FkRect";

function NodeRender(node: Node, prop?: ElementProperty) {
  function Rectangle(node: Node) {
    const rectangle = new RectangleShape(node.x, node.y, node.width, node.height);

    return (<FkRect
      node={ node }
      label={ node.label }
      key={ 'node-' + node.id }
      draggable={ true }
      shape={ rectangle }
      // onSelect={ (e) => {
      //   if (e.current !== undefined) {
      //     let temp = nodesArray;
      //     if (!nodesArray.includes(e.current)) temp.push(e.current);
      //     setNodes(temp);
      //     trRef.current!!.nodes(nodesArray);
      //     trRef.current!!.getLayer()!!.batchDraw();
      //   }
      //   selectShape(node.id);
      // } }
    />);
  }

  const renderNode = (node: Node, prop?: ElementProperty) => {
    switch (node.data?.shape) {
      case 'rectangle':
        return Rectangle(node);
      default:
        return Rectangle(node);
    }
  }

  return renderNode(node, prop);
}

export default NodeRender;
