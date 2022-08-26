import React from 'react';
import { Node, ElementProperty } from "@feakin/exporter";
import FkRect from "../graph/shapes/FkRect";

function NodeRender(node: Node, prop?: ElementProperty) {
  function Rectangle(node: Node) {
    return (<FkRect
      node={ node }
      label={ node.label }
      key={ 'node-' + node.id }
      draggable={ true }
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
      position={ {
        x: node.x || 0,
        y: node.y || 0,
        width: node.width || 0,
        height: node.height || 0,
      } }
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
