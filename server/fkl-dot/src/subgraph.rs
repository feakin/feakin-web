use std::fmt;

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
}

impl fmt::Display for Subgraph {
  fn fmt(&self, out: &mut fmt::Formatter<'_>) -> fmt::Result {
    out.write_str(&format!("subgraph {} {{", self.name))?;

    for node in &self.nodes {
      out.write_str(&format!("{}", node))?
    }

    for edge in &self.edges {
      out.write_str(&format!("{}", edge))?
    }

    for subgraph in &self.subgraph {
      out.write_str(&format!("{}", subgraph))?
    }

    out.write_str("}")
  }
}
