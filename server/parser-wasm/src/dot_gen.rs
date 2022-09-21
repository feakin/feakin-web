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
  use fkl_parser::parse;
  use crate::dot_gen::to_dot;

  #[test]
  fn test_to_dot() {
    let context_map = parse(r#"
ContextMap {
  ShoppingCarContext -> MallContext;
  ShoppingCarContext <-> MallContext;
}
    "#).unwrap();
    let string = to_dot(&context_map);
    println!("{}", string);
    // assert_eq!(to_dot(&context_map), r#"digraph fkl {ShoppingCarContext [label=\"ShoppingCarContext\"];MallContext [label=\"MallContext\"];}"#);
  }
}
