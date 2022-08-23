/**
 * FlowEdge is a drawable edge in mermaid.
 */
export interface FlowEdge {
  start: string,
  end: string,
  type?: 'arrow_open' | 'arrow_point' | 'arrow_circle' | 'arrow_cross',
  text: string,
  stroke?: 'normal' | 'thick' | 'dotted',
  length?: number
}

/**
 * FlowNode is a drawable node in mermaid.
 */
export interface FlowNode {
  id: string,
  domId: string,
  styles: string[],
  classes: string[],
  text?: string,
  dir?: string,
  type?: string | 'square',
  props?: object
}
