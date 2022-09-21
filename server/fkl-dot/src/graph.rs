use std::fmt;
use std::fmt::{Display, Formatter};

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

  pub fn add_edge(&mut self, source: &str, target: &str) {
    self.edges.push(Edge::new(source.to_string(), target.to_string()));
  }

  pub fn add_subgraph(&mut self, subgraph: Subgraph) {
    self.subgraph.push(subgraph);
  }

  pub fn set_name(&mut self, name: &String) {
    self.name = name.to_string();
  }
}

impl Display for Graph {
  fn fmt(&self, out: &mut Formatter<'_>) -> fmt::Result {
    out.write_str(&format!("digraph {} {{", self.name))?;

    for node in &self.nodes {
      // out.write_str(&format!("{}", ident(1)))?;
      out.write_str(&format!("{}", node))?
    }

    for edge in &self.edges {
      // out.write_str(&format!("{}", ident(1)))?;
      out.write_str(&format!("{}", edge))?
    }

    for subgraph in &self.subgraph {
      // out.write_str(&format!("{}", ident(1)))?;
      out.write_str(&format!("{}", subgraph))?
    }

    out.write_str("}")
  }
}
