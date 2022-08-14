import { Options } from "roughjs/bin/core";
import { RoughGenerator } from "roughjs/bin/generator";

const getDashArrayDashed = (strokeWidth: number) => [8, 8 + strokeWidth];


export const generateRoughOptions = (): Options => {
  const strokeWidth = 12;
  const options: Options = {
    seed: 1683771448,
    strokeLineDash: getDashArrayDashed(strokeWidth),
    disableMultiStroke: true,
    strokeWidth: 12,
    // calculate them (and we don't want the fills to be modified)
    fillWeight: strokeWidth / 2,
    hachureGap: strokeWidth * 4,
    roughness: 1,
    stroke: "#000000",
    preserveVertices: false,
  };

  return options
};

export class HandDrawn {
  private readonly generator: RoughGenerator;

  constructor() {
    this.generator = new RoughGenerator();
  }

  rectangle() {
    return this.generator.rectangle(
      0,
      0,
      200,
      200,
      generateRoughOptions(),
    )
  }
}
