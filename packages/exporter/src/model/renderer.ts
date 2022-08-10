import { EdgeData, Elements, NodeData } from "./graph";

export interface RendererContext {
  elementId?: string;
}

/**
 * Renderer (aka Graph Drawing) is a class that can be used to render a Graph object.
 */
export interface Renderer {
  arrowShapes: () => void;
  drawingElements: (context: RendererContext, elements: Elements) => void;

  drawingEdges: (edges: EdgeData) => void;
  drawingNodes: (nodes: NodeData[]) => void;
  drawingShapes: () => void;
  drawingImages: () => void;
  drawingLabelText: () => void;

  exportImage: () => void;
}
