import { Graph } from "../graph";

/**
 * Algorithm is a class that represents an algorithm for Graph objects.
 * like: BreadthFirstSearch, DepthFirstSearch, PageRank, K-Clustering, etc.
 */
export interface Algorithm {
  name: string;
  transform(graph: any): Graph;
}
