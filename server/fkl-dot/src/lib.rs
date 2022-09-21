pub mod graph;
pub mod subgraph;
pub mod node;
pub mod edge;
pub mod helper;


#[cfg(test)]
mod tests {
  use crate::graph::Graph;
  use crate::node::Node;
  use crate::subgraph::Subgraph;

  #[test]
  fn basic_graph() {
    let mut graph = Graph::new("empty_graph");
    graph.add_node(Node::new("a"));

    let subgraph = Subgraph::new("empty_subgraph", "Empty Subgraph");
    graph.add_subgraph(subgraph);

    assert_eq!(format!("{}", graph), "digraph empty_graph {a [label=\"a\"];subgraph empty_subgraph {label=\"Empty Subgraph\";}}");
  }

  #[test]
  fn nested_subgraph() {
    let mut graph = Graph::new("nested_subgraph");
    graph.add_node(Node::new("a"));

    let mut subgraph = Subgraph::new("empty_subgraph", "Empty Subgraph");
    subgraph.add_node(Node::new("b"));

    let mut nested_subgraph = Subgraph::new("nested_subgraph", "Nested Subgraph");
    nested_subgraph.add_node(Node::new("c"));
    subgraph.add_subgraph(nested_subgraph);

    graph.add_subgraph(subgraph);


    assert_eq!(format!("{}", graph), r#"digraph nested_subgraph {a [label="a"];subgraph cluster_empty_subgraph {label="Empty Subgraph";b [label="b"];subgraph cluster_nested_subgraph {label="Nested Subgraph";c [label="c"];}}}"#);
  }
}
