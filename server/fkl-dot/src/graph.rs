use std::fmt;
use std::fmt::{Display, Formatter};

use crate::edge::Edge;
use crate::node::Node;
use crate::subgraph::Subgraph;

pub struct Graph {
  name: String,
  nodes: Vec<Node>,
  edges: Vec<Edge>,
  node_styles: Vec<String>,
  subgraph: Vec<Subgraph>,
}

impl Graph {
  pub fn new(name: &str) -> Self {
    Graph {
      name: name.to_string(),
      nodes: Vec::new(),
      edges: Vec::new(),
      node_styles: vec![],
      subgraph: Vec::new(),
    }
  }

  pub fn add_node(&mut self, node: Node) {
    self.nodes.push(node);
  }

  pub fn add_edge(&mut self, source: &str, target: &str) {
    self.edges.push(Edge::new(source.to_string(), target.to_string()));
  }

  pub fn add_subgraph(&mut self, subgraph: Subgraph) {
    self.subgraph.push(subgraph);
  }

  pub fn set_name(&mut self, name: &str) {
    self.name = name.to_string();
  }

  pub fn add_node_style(&mut self, style: &str) {
    self.node_styles.push(style.to_string());
  }

  pub(crate) fn set_shape(&mut self, shape: &str) {
    self.add_node_style(&format!("shape={}", shape));
  }

  pub fn add_edge_with_style(&mut self, source: &str, target: &str, style: Vec<String>) {
    self.edges.push(Edge::styled(source.to_string(), target.to_string(), style));
  }

  pub(crate) fn set_style(&mut self, style: &str) {
    self.add_node_style(&format!("style={}", style));
  }

  pub fn use_default_style(&mut self) {
    self.set_shape("box");
    self.set_style("filled");
  }
}

impl Display for Graph {
  fn fmt(&self, out: &mut Formatter<'_>) -> fmt::Result {
    out.write_str(&format!("digraph {} {{", self.name))?;

    // render node styles: node [shape=rect style=filled]
    if !self.node_styles.is_empty() {
      out.write_str("node [")?;
      for style in &self.node_styles {
        out.write_str(&format!("{} ", style))?;
      }
      out.write_str("];")?;
    }

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
