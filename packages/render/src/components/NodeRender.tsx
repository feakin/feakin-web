import React from 'react';
import { DiamondShape, ElementProperty, Node, PolygonShape, RectangleShape, TriangleShape } from "@feakin/exporter";
import FkRect from "./shapes/FkRect";
import FkPolygonShape from "./shapes/FkPolygonShape";
import { RenderOptions } from "../type";

function NodeRender(node: Node, prop?: ElementProperty, options: RenderOptions = {}) {
  function Rectangle(node: Node) {
    const rectangle = new RectangleShape(node.x, node.y, node.width, node.height);

    return (<FkRect node={ node } key={ 'node-' + node.id } draggable={ true } shape={ rectangle }/>);
  }

  function Polygon(node: Node, shape: PolygonShape) {
    return (<FkPolygonShape node={ node } key={ 'node-' + node.id } shape={ shape }/>);
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
