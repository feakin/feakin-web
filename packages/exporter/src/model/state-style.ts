/**
 * StateStyle is a style for a state.
 */
export interface StrokeState {
  strokeColor: string;
  strokeWidth: number;
  strokeOpacity: number;
}

export interface ImageState {
  image: string;
  backgroundColor: string;
  align: string;
  valign: string;
  borderColor: string;

  width: number;
  height: number;
}
