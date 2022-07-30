export interface RendererContext {
  elementId?: string;
}

export interface SimpleElement {
  id: string;
}

// inspired by cytoscape.js
export interface Renderer {
  arrowShapes: () => void;
  drawingElements: (context: RendererContext, elements: SimpleElement[]) => void;

  drawingEdges: () => void;
  drawingNodes: () => void;
  drawingShapes: () => void;
  drawingImages: () => void;
  drawingLabelText: () => void;

  exportImage: () => void;
}
