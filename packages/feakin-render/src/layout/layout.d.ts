import { FkPosition } from "../geometry/FkPosition";


// transform: function (node, position ){ return position; }
type LayoutTransform = (node: any[], position: FkPosition ) => FkPosition;

export interface BaseLayout {
  transform: LayoutTransform;
}
