use crate::edge::Edge;
use crate::node::Node;
use crate::subgraph::Subgraph;

pub struct Graph {
  name: String,
  nodes: Vec<Node>,
  edges: Vec<Edge>,
  subgraph: Vec<Subgraph>,
}

impl Graph {
  pub fn new(name: &str) -> Self {
    Graph {
      name: name.to_string(),
      nodes: Vec::new(),
      edges: Vec::new(),
      subgraph: Vec::new(),
    }
  }

  pub(crate) fn add_node(&mut self, node: Node) {
    self.nodes.push(node);
  }

  pub(crate) fn add_subgraph(&mut self, subgraph: Subgraph) {
    self.subgraph.push(subgraph);
  }

  pub(crate) fn to_dot(&self) -> String {
    let mut dot = String::new();

    dot.push_str(&format!("digraph {} {{", self.name));

    for node in &self.nodes {
      dot.push_str(&format!("{};", node.to_dot()));
    }

    for subgraph in &self.subgraph {
      dot.push_str(&format!("{};", subgraph.to_dot()));
    }

    dot.push_str("}");

    dot
  }
}
