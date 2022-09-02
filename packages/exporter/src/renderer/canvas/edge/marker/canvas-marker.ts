import { MarkerShapeOption } from "../marker-shape-option";
import { Marker } from "../../../../model/edge/marker/arrow-marker";

export class CanvasMarker implements Marker<void> {
  protected readonly canvas: CanvasRenderingContext2D;
  protected readonly options: MarkerShapeOption;

  constructor(context: CanvasRenderingContext2D, shapeOptions: MarkerShapeOption) {
    this.canvas = context;
    this.options = shapeOptions;
  }

  draw(): void {
    return;
  }
}
