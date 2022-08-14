import { Drawable, Options } from "roughjs/bin/core";
import { RoughGenerator } from "roughjs/bin/generator";
import { RectangleShape } from "@feakin/exporter";

const getDashArrayDashed = (strokeWidth: number) => [8, 8 + strokeWidth];

export interface HandDrawingOption {
  strokeWidth: number;
}

export const defaultHandDrawingOption: HandDrawingOption = {
  strokeWidth: 12
}

export const generateRoughOptions = (option: HandDrawingOption = defaultHandDrawingOption): Options => {
  return {
    seed: 1683771448,
    strokeLineDash: getDashArrayDashed(option.strokeWidth),
    disableMultiStroke: true,
    strokeWidth: option.strokeWidth,
    fillWeight: option.strokeWidth / 2,
    hachureGap: option.strokeWidth * 4,
    roughness: 1,
    stroke: "#000000",
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
      generateRoughOptions(),
    )
  }

  /**
   * paths here is an array of PathInfo objects.
   */
  paths(drawable: Drawable) {
    return this.generator.toPaths(drawable);
  }
}
