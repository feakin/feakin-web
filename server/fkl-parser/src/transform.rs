use std::collections::HashMap;

use crate::{ContextMap, mir, ParseError};
use crate::mir::{BoundedContext, ConnectionDirection, ContextRelationType};
use crate::parser::parse as ast_parse;
use crate::parser::ast::{FklDeclaration, RelationDirection};

pub struct Transform {
  pub contexts: HashMap<String, BoundedContext>,
  pub relations: Vec<mir::ContextRelation>
}

impl Transform {
  pub fn mir(str: &str) -> Result<ContextMap, ParseError> {
    let mut transform = Transform {
      contexts: Default::default(),
      relations: vec![]
    };

    match ast_parse(str) {
      Ok(decls) => {
        decls.iter().for_each(|decl| {
          match decl {
            FklDeclaration::None => {}
            FklDeclaration::ContextMap(context_map) => {
              transform.contexts = context_map.contexts.iter().map(|context| {
                let bounded_context = mir::BoundedContext::new(&context.name);
                (bounded_context.name.clone(), bounded_context)
              }).collect();

              transform.relations = context_map.relations.iter().map(|relation| {
                mir::ContextRelation {
                  source: relation.source.clone(),
                  target: relation.target.clone(),
                  connection_type: transform_connection(&relation.direction),
                  source_type: ContextRelationType::from_str(&relation.source_type),
                  target_type: ContextRelationType::from_str(&relation.target_type),
                }
              }).collect();
            }
            FklDeclaration::BoundedContext(_) => {}
            FklDeclaration::Domain(_) => {}
            FklDeclaration::Aggregate(_) => {}
            FklDeclaration::DomainService(_) => {}
            FklDeclaration::ApplicationService(_) => {}
            FklDeclaration::Entity(_) => {}
            FklDeclaration::ValueObject(_) => {}
            FklDeclaration::Component(_) => {}
          }
        });
      }
      Err(e) => return Err(e),
    };

    Ok(ContextMap {
      name: "".to_string(),
      state: Default::default(),
      contexts: transform.contexts.values().map(|context| context.clone()).collect(),
      relations: transform.relations,
    })
  }
}

fn transform_connection(rd: &RelationDirection) -> ConnectionDirection {
  match rd {
    RelationDirection::Undirected => ConnectionDirection::Undirected,
    RelationDirection::PositiveDirected => ConnectionDirection::PositiveDirected,
    RelationDirection::NegativeDirected => ConnectionDirection::NegativeDirected,
    RelationDirection::BiDirected => ConnectionDirection::BiDirected,
  }
}

#[cfg(test)]
mod tests {
  use crate::transform::Transform;

  #[test]
  fn test_mir() {
    let str = r#"
ContextMap {
  ShoppingCarContext -> MallContext;
  ShoppingCarContext <-> MallContext;
}
"#;
    let result = Transform::mir(str);
    println!("{:?}", result);
  }
}
