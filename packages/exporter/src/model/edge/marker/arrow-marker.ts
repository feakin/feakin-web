export interface ArrowMarker<T> {
  calculate() : T;
  draw(canvas: CanvasRenderingContext2D) : void;
}
