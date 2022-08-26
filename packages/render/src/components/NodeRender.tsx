import React from 'react';
import { Node, ElementProperty, RectangleShape, PolygonShape, TriangleShape, DiamondShape } from "@feakin/exporter";
import FkRect from "./shapes/FkRect";
import FkPolygonShape from "./shapes/FkPolygonShape";

function NodeRender(node: Node, prop?: ElementProperty) {
  function Rectangle(node: Node) {
    const rectangle = new RectangleShape(node.x, node.y, node.width, node.height);

    return (<FkRect
      node={ node }
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

  function Polygon(node: Node, shape: PolygonShape) {
    return (<FkPolygonShape
      node={ node }
      key={ 'node-' + node.id }
      shape={ shape }
    />);
  }

  const renderNode = (node: Node, prop?: ElementProperty) => {
    switch (node.data?.shape) {
      case 'rectangle':
        return Rectangle(node);
      case 'diamond':
        const diamondShape = new DiamondShape(node.x, node.y, node.width, node.height);
        return Polygon(node, diamondShape);
      case 'triangle':
        const triangle = new TriangleShape(node.x, node.y, node.width, node.height);
        return Polygon(node, triangle);
      default:
        return Rectangle(node);
    }
  }

  return renderNode(node, prop);
}

export default NodeRender;
