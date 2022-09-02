import { Point } from "../../../model/geometry/point";
import { EdgeProperty } from "../../../model/graph";
import { renderMarker } from "./marker-shape";
import { CanvasLineDrawing } from "./canvas-line-drawing";
import { ConnectorDrawing } from "../../base/connector-drawing";

export function insertControlPointsInCenter(points: Point[], controlPoints: Point[]) {
  let mergedPoints: Point[] = [...points];
  if (controlPoints.length > 0) {
    mergedPoints.shift();
    mergedPoints = [points[0], ...controlPoints, ...mergedPoints];
  }
  return mergedPoints;
}

export function preparePoints(points: Point[], controlPoints: Point[]) {
  // todo: refactor to endArrowhead
  const scale = 1;

  const mergedPoints = insertControlPointsInCenter(points, controlPoints);
  const pts: Point[] = [];
  for (let i = 0; i < mergedPoints.length; i++) {
    const p = mergedPoints[i];

    pts.push({
      x: p.x / scale,
      y: p.y / scale
    })
  }

  return pts;
}

export class CanvasConnectorDrawing extends ConnectorDrawing<CanvasRenderingContext2D, void> {
  constructor(ctx: CanvasRenderingContext2D, props: EdgeProperty, points: Point[] = []) {
    super(ctx, props, points);
  }

  override render() {
    this.ctx.strokeStyle = this.props.stroke?.color || '#000000';
    this.ctx.lineWidth = this.props.stroke?.width || 1;
    this.ctx.fillStyle = this.props.fill?.color || '#ffffff';

    this.paintStartMarker();
    this.paintEndMarker();
  }

  override paintStartMarker(): void {
    this.paintMarker(true);
  }

  override paintEndMarker(): void {
    this.paintMarker(false);
  }

  protected override paintMarker(source: boolean): void {
    const arrowhead = source ? this.props.decorator!.startArrowhead : this.props.decorator!.endArrowhead;
    renderMarker(this.ctx, arrowhead, this.points, source, this.props);
  }

  static paint(ctx: CanvasRenderingContext2D, props: EdgeProperty, points: Point[] = [], controlPoints: Point[] = []): void {
    const pts = preparePoints(points, controlPoints);

    const connectorDrawing = new CanvasConnectorDrawing(ctx, props, pts);
    connectorDrawing.render();

    const lineDrawing = new CanvasLineDrawing(ctx, props, pts);
    lineDrawing.paint();
  }
}
