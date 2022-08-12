import { Edge, Node, Layers } from "../graph";

export interface RendererContext {
  elementId?: string;
}

/**
 * Renderer (aka Graph Drawing) is a class that can be used to render a Graph object.
 */
export interface Renderer {
  arrowShapes: () => void;
  drawingElements: (context: RendererContext, elements: Layers) => void;

  drawingEdges: (edges: Edge[]) => void;
  drawingNodes: (nodes: Node[]) => void;
  drawingShapes: () => void;
  drawingImages: () => void;
  drawingLabelText: () => void;

  exportImage: () => void;
}
