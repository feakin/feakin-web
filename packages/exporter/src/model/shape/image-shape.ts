import { Shape, ShapeResourceType } from "./shape";
import { ShapeType } from "./shape-type";

export class ImageShape extends Shape {
  override hasResource = true;
  override type = ShapeType.Image;

  imageSrc: string;

  readonly width: number;
  readonly height: number;

  constructor(x = 0, y = 0, width = 0, height = 0, imageSrc: string) {
    super(x, y);
    this.width = width;
    this.height = height;

    this.imageSrc = imageSrc;
  }

  override resource() {
    return {
      type: ShapeResourceType.Image,
      src: this.imageSrc
    }
  }
}
