export interface Definition {
  label: string,
  width: number,
  height: number
}

export interface NodeDefinition {
  id: string;
  definition: Definition
}

export type Point = { x: number; y: number };
export const flattenPoints = (points: Point[]): number[] => {
  const flatten: number[] = [];
  points.forEach(({ x, y }) => flatten.push(x, y));
  return flatten;
};
