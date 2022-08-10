import { EdgeData, Elements, NodeData } from "./element";

export interface RendererContext {
  elementId?: string;
}

// inspired by cytoscape.js
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
