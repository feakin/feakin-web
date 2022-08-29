import { ALIGN } from "./props-constants";

/**
 * ImageProp is a style for Image.
 */
export interface ImageProp {
  // imageUrl
  image?: string;
  backgroundColor: string;
  borderColor: string;

  align: ALIGN;
  valign: string;

  width: number;
  height: number;
}
