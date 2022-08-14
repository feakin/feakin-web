import { ALIGN } from "./style-constants";

/**
 * ImageState is a style for Image.
 */
export interface ImageState {
  // imageUrl
  image?: string;
  backgroundColor: string;
  borderColor: string;

  align: ALIGN;
  valign: string;

  width: number;
  height: number;
}
