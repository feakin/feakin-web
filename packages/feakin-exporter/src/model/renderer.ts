// inspired by cytoscape.js
export interface Renderer {
  arrowShapes: () => void;
  drawingElements: () => void;
  drawingEdges: () => void;
  drawingImages: () => void;
  drawingLabelText: () => void;
  drawingNodes: () => void;
  drawingRedraw: () => void;
  drawingShapes: () => void;
  exportImage: () => void;
  nodeShapes: () => void;
}
