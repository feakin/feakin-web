use fkl_dot::graph::Graph;
use fkl_dot::node::Node;
use fkl_dot::subgraph::Subgraph;
use fkl_parser::ast::FklDeclaration;

pub(crate) fn to_dot(decls: &Vec<FklDeclaration>) -> String {
  let mut graph = Graph::new("fkl");
  decls.iter().for_each(|decl| {
    match decl {
      FklDeclaration::ContextMap(contextMap) => {
        graph.set_name(&contextMap.name);
        contextMap.contexts.iter().for_each(|context| {
          let mut subgraph = Subgraph::new(&context.name, &context.name);
          context.aggregates.iter().for_each(|aggregate| {
            let mut node = Node::new(&aggregate.name);
            subgraph.add_node(node);
          });
          graph.add_subgraph(subgraph);
        });

        contextMap.relations.iter().for_each(|relation| {
          graph.add_edge(&relation.source, &relation.target);
        });
      }
      FklDeclaration::BoundedContext(bc) => {
        let mut subgraph = Subgraph::new(&bc.name, &bc.name);
        bc.aggregates.iter().for_each(|aggregate| {
          subgraph.add_node(Node::new(&aggregate.name));
        });
        graph.add_subgraph(subgraph);
      }
      FklDeclaration::Aggregate(_) => {}
      FklDeclaration::Entity(_) => {}
      FklDeclaration::ValueObject(_) => {}
      _ => {}
    }
  });
  format!("{}", graph)
}

#[cfg(test)]
mod test {
  use crate::dot_gen::to_dot;
  use fkl_parser::parser::parse;

  #[test]
  fn test_to_dot() {
    let decls = parse("ContextMap TestContextMap {
      Mall -> Customer;
    }").unwrap();
    let dot = to_dot(&decls);
    assert_eq!(dot, r#"digraph TestContextMap {Mall -> Customer;subgraph cluster_customer {label="Customer";}subgraph cluster_mall {label="Mall";}"#);
  }
}
