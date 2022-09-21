use fkl_dot::graph::Graph;
use fkl_dot::subgraph::Subgraph;
use fkl_parser::ast::FklDeclaration;

pub(crate) fn to_dot(decls: &Vec<FklDeclaration>) -> String {
  let mut graph = Graph::new("fkl");
  let mut subgraph = Subgraph::new("fkl", "fkl");
  decls.iter().for_each(|decl| {
    match decl {
      FklDeclaration::ContextMap(_) => {}
      FklDeclaration::BoundedContext(_) => {}
      FklDeclaration::Aggregate(_) => {}
      FklDeclaration::Entity(_) => {}
      FklDeclaration::ValueObject(_) => {}
      _ => {}
    }
  });
  graph.add_subgraph(subgraph);
  format!("{}", graph)
}

#[cfg(test)]
mod test {
  use crate::dot_gen::to_dot;
  use fkl_parser::ast::FklDeclaration;
  use fkl_parser::parser::parse;

  #[test]
  fn test_to_dot() {
    let decls = parse("ContextMap TestContextMap {
      Mall -> Customer;
    }").unwrap();
    let dot = to_dot(&decls);
    assert_eq!(dot, r#"digraph fkl {subgraph cluster_fkl {label="fkl";}}"#);
  }
}
