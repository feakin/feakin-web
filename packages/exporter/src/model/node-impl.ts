import { Node } from './graph';
import { ShapeType } from "./node/base/shape-type";

export interface DataExt<D> {
  data(): D;
}

export class NodeImpl implements Node, DataExt<Node> {
  id: string;
  label: string;

  constructor(id: string, label: string) {
    this.id = id;
    this.label = label;
  }

  shapeFromString(shapeName: string): ShapeType {
    switch (shapeName.toLowerCase()) {
      case 'rectangle':
        return ShapeType.Rectangle;
      case 'triangle':
        return ShapeType.Triangle;
      case 'diamond':
        return ShapeType.Diamond;
      case 'hexagon':
        return ShapeType.Hexagon;
      case 'ellipse':
        return ShapeType.Ellipse;
      case 'line':
        return ShapeType.Line;
      case 'polygon':
        return ShapeType.Polygon;
      case 'text':
        return ShapeType.Text;
      case 'image':
        return ShapeType.Image;
      default:
        return ShapeType.Rectangle;
    }
  }

  data(): Node {
    return this;
  }
}
