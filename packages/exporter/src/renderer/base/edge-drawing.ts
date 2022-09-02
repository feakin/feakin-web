/**
 * <T> can be canvas or svg or any other object
 */
export interface EdgeDrawing<T, R> {
  draw(canvas: T): R;
}
