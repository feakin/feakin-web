use std::collections::HashMap;
use fkl_dot::graph::Graph;
use fkl_dot::node::Node;
use fkl_parser::mir::{ConnectionDirection, ContextMap, ContextRelation, ContextRelationType};

pub(crate) fn to_dot(context_map: &ContextMap) -> String {
  let mut graph = Graph::new(&context_map.name);
  graph.use_default_style();

  context_map
    .contexts
    .iter()
    .for_each(|context| {
      graph.add_node(Node::new(&context.name))
    });

  context_map
    .relations
    .iter()
    .for_each(|relation| {
      process_context_edge(&mut graph, &relation);
    });

  format!("{}", graph)
}

fn process_context_edge(graph: &mut Graph, relation: &&ContextRelation) {
  match &relation.connection_type {
    ConnectionDirection::Undirected => {}
    ConnectionDirection::PositiveDirected => {
      // add_edge_labels(graph, &relation.source, &relation.target);
      graph.add_edge(&relation.source, &relation.target);
    }
    ConnectionDirection::NegativeDirected => {
      graph.add_edge(&relation.target, &relation.source);
    }
    ConnectionDirection::BiDirected => {
      graph.add_edge(&relation.target, &relation.source);
      graph.add_edge(&relation.source, &relation.target);
    }
  }
}

#[derive(Eq, PartialEq, Debug)]
pub struct BcEdgeStyle {
  pub label: String,
  pub head_label: String,
  pub tail_label: String,
}

pub(crate) fn generate_edge_style(source: &Vec<ContextRelationType>, target: &Vec<ContextRelationType>) -> BcEdgeStyle {
  let mut style = BcEdgeStyle {
    label: "".to_string(),
    head_label: "".to_string(),
    tail_label: "".to_string(),
  };

  if source.len() > 0 {
    style.label = source.iter().map(|t| t.to_string()).collect::<Vec<String>>().join(", ");
  }

  if source.len() > 0 {
    style.head_label = source.iter().map(|t|
      map_from_type(t).get("headlabel").unwrap_or(&"".to_string()).to_string()
    )
      .collect::<Vec<String>>().join(", ");
  }

  if target.len() > 0 {
    style.tail_label = target.iter().map(|t|
      map_from_type(t).get("taillabel").unwrap_or(&"".to_string()).to_string()
    )
      .collect::<Vec<String>>().join(", ");
  }

  style
}

fn map_from_type(context_type: &ContextRelationType) -> HashMap<String, String> {
  let mut style = HashMap::new();
  match context_type {
    ContextRelationType::None => {}
    ContextRelationType::SharedKernel => {}
    ContextRelationType::Partnership => {}
    ContextRelationType::SeparateWay => {}
    ContextRelationType::CustomerSupplier => {
      style.insert("headlabel".to_string(), "D".to_string());
      style.insert("taillabel".to_string(), "U".to_string());
    }
    ContextRelationType::Conformist => {
      style.insert("headlabel".to_string(), "D".to_string());
      style.insert("taillabel".to_string(), "U".to_string());
    }
    ContextRelationType::AntiCorruptionLayer => {
      style.insert("headlabel".to_string(), "D".to_string());
      style.insert("taillabel".to_string(), "U".to_string());
    }
    ContextRelationType::OpenHostService => {
      style.insert("headlabel".to_string(), "D".to_string());
      style.insert("taillabel".to_string(), "U".to_string());
    }
    ContextRelationType::PublishedLanguage => {
      style.insert("headlabel".to_string(), "D".to_string());
      style.insert("taillabel".to_string(), "U".to_string());
    }
    ContextRelationType::BigBallOfMud => {
      style.insert("headlabel".to_string(), "*".to_string());
      style.insert("taillabel".to_string(), "*".to_string());
    }
  }

  style
}

#[cfg(test)]
mod test {
  use fkl_parser::mir::ContextRelationType;
  use fkl_parser::parse;
  use crate::dot_gen::{BcEdgeStyle, generate_edge_style, to_dot};

  #[test]
  fn test_to_dot() {
    let context_map = parse(r#"
ContextMap {
  ShoppingCartContext -> MallContext;
  ShoppingCartContext <-> MallContext;
}
    "#).unwrap();
    let string = to_dot(&context_map);

    let except = r#"digraph  {node [shape=box style=filled ];ShoppingCartContext [label="ShoppingCartContext"];MallContext [label="MallContext"];MallContext -> ShoppingCartContext;MallContext -> ShoppingCartContext;ShoppingCartContext -> MallContext;}"#;
    assert_eq!(string.len(), except.len());
  }

  #[test]
  fn test_context_map_edge_style_shared_kernel() {
    let style = generate_edge_style(&vec![ContextRelationType::SharedKernel], &vec![ContextRelationType::SharedKernel]);
    assert_eq!(style, BcEdgeStyle {
      label: "SharedKernel".to_string(),
      head_label: "".to_string(),
      tail_label: "".to_string(),
    });

    let style = generate_edge_style(&vec![ContextRelationType::AntiCorruptionLayer], &vec![]);
    assert_eq!(style, BcEdgeStyle {
      label: "AntiCorruptionLayer".to_string(),
      head_label: "D".to_string(),
      tail_label: "".to_string(),
    });
  }
}
