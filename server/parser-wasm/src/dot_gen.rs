use fkl_dot::graph::Graph;
use fkl_dot::node::Node;
use fkl_parser::mir::ContextMap;

pub(crate) fn to_dot(context_map: &ContextMap) -> String {
  let mut graph = Graph::new("fkl");
  context_map
    .contexts
    .iter()
    .for_each(|context| graph.add_node(Node::new(&context.name)));
  format!("{}", graph)
}

#[cfg(test)]
mod test {
  use fkl_parser::mir::ContextMap;
  use crate::dot_gen::to_dot;
  use fkl_parser::parser::parse;

  #[test]
  fn test_to_dot() {
    let map = &ContextMap::default();
    let result = to_dot(map);

    assert_eq!(result, "digraph fkl {}");
  }
}
