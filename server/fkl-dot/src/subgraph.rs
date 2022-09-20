use crate::edge::Edge;
use crate::node::Node;

pub struct Subgraph {
  name: String,
  depth: usize,
  nodes: Vec<Node>,
  edges: Vec<Edge>,
  subgraph: Vec<Subgraph>,
}

impl Subgraph {
  pub fn new(name: &str) -> Self {
    Subgraph {
      name: name.to_string(),
      depth: 0,
      nodes: Vec::new(),
      edges: Vec::new(),
      subgraph: Vec::new(),
    }
  }

  pub(crate) fn to_dot(&self) -> String {
    let mut dot = String::new();

    dot.push_str(&format!("subgraph {} {{", self.name));

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
