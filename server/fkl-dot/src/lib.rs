pub mod config;
pub mod graph;
pub mod subgraph;
pub mod node;
pub mod edge;


#[cfg(test)]
mod tests {
  use crate::graph::Graph;
  use crate::node::Node;
  use crate::subgraph::Subgraph;

  #[test]
  fn sample_for_graph() {
    let mut graph = Graph::new("empty_graph");
    graph.add_node(Node::new("a"));

    let subgraph = Subgraph::new("empty_subgraph", "Empty Subgraph");

    graph.add_subgraph(subgraph);

    assert_eq!(format!("{}", graph), "digraph empty_graph {a [label=\"a\"];subgraph empty_subgraph {label=\"Empty Subgraph\";}}");
  }
}
