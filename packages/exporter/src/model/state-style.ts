/**
 * Stroke style to be used for painting the outline of the shape.
 */
export interface StrokeState {
  strokeColor: string;
  strokeWidth: number;
  strokeOpacity: number;
}

/**
 * ImageState is a style for Image.
 */
export interface ImageState {
  image: string;
  backgroundColor: string;
  align: string;
  valign: string;
  borderColor: string;

  width: number;
  height: number;
}

/**
 * SpaceState is a space style is a geometry for Space.
 */
export interface SpaceState {
  spacing: number;
  spacingTop: number;
  spacingBottom: number;
  spacingLeft: number;
  spacingRight: number;
}

/**
 * PaddingState a padding like in CSS.
 */
export interface PaddingState {
  padding?: number | undefined;
  paddingX?: number | undefined;
  paddingY?: number | undefined;
}
