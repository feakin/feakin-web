/**
 * ImageProp is a style for Image.
 */
import { ALIGN } from "./props-constants";

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
