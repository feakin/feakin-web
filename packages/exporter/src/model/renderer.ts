import { Edge, Node, Graph } from "./graph";

export interface RendererContext {
  elementId?: string;
}

/**
 * Renderer (aka Graph Drawing) is a class that can be used to render a Graph object.
 */
export interface Renderer {
  arrowShapes: () => void;
  drawingElements: (context: RendererContext, elements: Graph) => void;

  drawingEdges: (edges: Edge[]) => void;
  drawingNodes: (nodes: Node[]) => void;
  drawingShapes: () => void;
  drawingImages: () => void;
  drawingLabelText: () => void;
}
