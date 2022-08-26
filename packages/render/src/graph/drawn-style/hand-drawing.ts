import { Drawable, Options } from "roughjs/bin/core";
import { RoughGenerator } from "roughjs/bin/generator";

import { Point, randomInteger, RectangleShape, Shape } from "@feakin/exporter";

const getDashArrayDashed = (strokeWidth: number) => [8, 8 + strokeWidth];

export interface HandDrawingOption {
  strokeWidth: number;
  strokeColor: string;
}

export const defaultHandDrawingOption: HandDrawingOption = {
  strokeWidth: 2,
  strokeColor: '#000',
}

export const generateRoughOptions = (
  shape: Shape,
  option: HandDrawingOption = defaultHandDrawingOption
): Options => {
  return {
    seed: randomInteger(),
    strokeLineDash: getDashArrayDashed(option.strokeWidth),
    disableMultiStroke: true,
    strokeWidth: option.strokeWidth,
    fillWeight: option.strokeWidth / 2,
    hachureGap: option.strokeWidth * 4,
    roughness: 1,
    stroke: option.strokeColor,
    preserveVertices: false,
  }
};

export class HandDrawing {
  private readonly generator: RoughGenerator;

  constructor() {
    this.generator = new RoughGenerator();
  }

  rectangle(rect: RectangleShape) {
    return this.generator.rectangle(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      generateRoughOptions(rect),
    )
  }

  line(start: Point, end: Point) {
    const options = generateRoughOptions(new Shape());
    return this.generator.line(start.x, start.y, end.x, end.y, options);
  }

  path(points: Point[]) {
    const rPoints: [number, number][] = points.map(p => [p.x, p.y]);
    return this.generator.linearPath(rPoints, generateRoughOptions(new Shape()));
  }

  curve(points: Point[]) {
    const rPoints: [number, number][] = points.map(p => [p.x, p.y]);
    return this.generator.curve(rPoints, generateRoughOptions(new Shape()));
  }

  polygon(points: Point[]) {
    const rPoints: [number, number][] = points.map(p => [p.x, p.y]);
    return this.generator.polygon(rPoints, generateRoughOptions(new Shape()));
  }

  /**
   * paths here is an array of PathInfo objects.
   */
  paths(drawable: Drawable) {
    return this.generator.toPaths(drawable);
  }
}
