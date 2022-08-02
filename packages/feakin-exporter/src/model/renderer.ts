import { EdgeDataDefinition, ElementsDefinition, NodeDataDefinition } from "./element";

export interface RendererContext {
  elementId?: string;
}

// inspired by cytoscape.js
export interface Renderer {
  arrowShapes: () => void;
  drawingElements: (context: RendererContext, elements: ElementsDefinition) => void;

  drawingEdges: (edges: EdgeDataDefinition) => void;
  drawingNodes: (nodes: NodeDataDefinition[]) => void;
  drawingShapes: () => void;
  drawingImages: () => void;
  drawingLabelText: () => void;

  exportImage: () => void;
}
