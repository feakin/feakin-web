use std::collections::HashMap;
use pest::iterators::{Pair, Pairs};

use crate::parser::ast::{Aggregate, BoundedContext, ContextRelation, ContextMap, Entity, Field, FklDeclaration, RelationDirection, ValueObject, Component, Attribute};
use crate::parser::parse_result::{ParseError, ParseResult};
use crate::pest::Parser;

#[derive(Parser)]
#[grammar = "parser/fkl.pest"]
pub struct FklParser;

pub fn parse(code: &str) -> ParseResult<Vec<FklDeclaration>> {
  match FklParser::parse(Rule::declarations, code) {
    Err(e) => {
      let fancy_e = e.renamed_rules(|rule| {
        match *rule {
          _ => {
            format!("{:?}", rule)
          }
        }
      });
      return Err(ParseError::msg(fancy_e));
    }
    Ok(pairs) => {
      Ok(consume_declarations(pairs))
    }
  }
}

fn consume_declarations(pairs: Pairs<Rule>) -> Vec<FklDeclaration> {
  pairs.filter(|pair| {
    return pair.as_rule() == Rule::declaration;
  }).map(|pair| {
    let mut decl: FklDeclaration = FklDeclaration::None;
    for p in pair.into_inner() {
      match p.as_rule() {
        Rule::context_map_decl => {
          decl = FklDeclaration::ContextMap(consume_context_map(p));
        }
        Rule::context_decl => {
          decl = FklDeclaration::BoundedContext(consume_context(p));
        }
        Rule::aggregate_decl => {
          decl = FklDeclaration::Aggregate(consume_aggregate(p));
        }
        Rule::entity_decl => {
          decl = FklDeclaration::Entity(consume_entity(p));
        }
        Rule::component_decl => {
          decl = FklDeclaration::Component(consume_component(p));
        }
        _ => println!("unreachable content rule: {:?}", p.as_rule())
      };
    }
    return decl;
  }).collect::<Vec<FklDeclaration>>()
}

fn consume_context_map(pair: Pair<Rule>) -> ContextMap {
  let mut context_decl_map: HashMap<String, BoundedContext> = HashMap::new();
  let mut context_name = String::new();
  let mut relations: Vec<ContextRelation> = Vec::new();

  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        context_name = p.as_str().to_string();
      }
      Rule::context_node_rel => {
        let mut names: Vec<String> = vec![];
        let mut direction: RelationDirection = RelationDirection::Undirected;

        for p in p.into_inner() {
          match p.as_rule() {
            Rule::identifier => {
              let context_name = p.as_str().to_string();
              names.push(context_name.clone());
              context_decl_map.insert(context_name.clone(), BoundedContext {
                name: context_name,
                aggregates: vec![],
              });
            }
            Rule::rel_symbol => {
              for p in p.into_inner() {
                match p.as_rule() {
                  Rule::rs_both => {
                    direction = RelationDirection::BiDirected;
                  }
                  Rule::rs_left_to_right => {
                    direction = RelationDirection::PositiveDirected;
                  }
                  Rule::rs_right_to_left => {
                    direction = RelationDirection::NegativeDirected;
                  }
                  _ => println!("unreachable entity rule: {:?}", p.as_rule())
                };
              }
            }
            _ => println!("unreachable content rule: {:?}", p.as_rule())
          };
        }

        relations.push(ContextRelation {
          source: names[0].clone(),
          target: names[1].clone(),
          connection_type: direction,
          source_type: None,
          target_type: None,
        });
      }
      _ => println!("unreachable context_map rule: {:?}", p.as_rule())
    };
  }

  // sort context map by name
  let mut contexts = context_decl_map.into_iter().map(|(_, v)| v)
    .collect::<Vec<BoundedContext>>();

  contexts.sort_by(|a, b| a.name.cmp(&b.name));

  return ContextMap {
    name: context_name,
    state: Default::default(),
    contexts,
    relations,
  };
}

fn consume_context(pair: Pair<Rule>) -> BoundedContext {
  let mut context = BoundedContext::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        context.name = p.as_str().to_string();
      }
      Rule::aggregate_decl => {
        context.aggregates.push(consume_aggregate(p));
      }
      _ => println!("unreachable context rule: {:?}", p.as_rule())
    };
  }
  return context;
}

fn consume_aggregate(pair: Pair<Rule>) -> Aggregate {
  let mut aggregate = Aggregate::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        aggregate.name = p.as_str().to_string();
      }
      Rule::inline_doc => {
        aggregate.inline_doc = parse_inline_doc(p);
      }
      Rule::entity_decl => {
        aggregate.entities.push(consume_entity(p));
      }
      _ => println!("unreachable aggregate rule: {:?}", p.as_rule())
    };
  }
  return aggregate;
}

fn consume_entity(pair: Pair<Rule>) -> Entity {
  let mut entity = Entity::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        entity.name = p.as_str().to_string();
      }
      Rule::constructor_decl => {
        entity.fields = consume_constructor(p);
      }
      Rule::inline_doc => {
        entity.inline_doc = parse_inline_doc(p);
      }
      Rule::value_object_decl => {
        entity.value_objects.push(consume_value_object(p));
      }
      _ => println!("unreachable entity rule: {:?}", p.as_rule())
    };
  }
  return entity;
}

fn consume_constructor(pair: Pair<Rule>) -> Vec<Field> {
  let mut fields: Vec<Field> = vec![];
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::parameters_decl => {
        for p in p.into_inner() {
          match p.as_rule() {
            Rule::parameter_decl => {
              fields.push(consume_parameter(p));
            }
            _ => println!("unreachable parameter_decl rule: {:?}", p.as_rule())
          }
        }
      }
      _ => println!("unreachable constructor rule: {:?}", p.as_rule())
    };
  }
  return fields;
}

fn consume_parameter(pair: Pair<Rule>) -> Field {
  let mut field = Field::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        field.name = p.as_str().to_string();
      }
      Rule::param_type => {
        field.field_type = p.as_str().to_string();
      }
      _ => println!("unreachable parameter rule: {:?}", p.as_rule())
    };
  }
  return field;
}

fn consume_value_object(pair: Pair<Rule>) -> ValueObject {
  let mut value_object = ValueObject::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        value_object.name = p.as_str().to_string();
      }
      _ => println!("unreachable value_object rule: {:?}", p.as_rule())
    };
  }
  return value_object;
}

fn consume_component(pair: Pair<Rule>) -> Component {
  let mut component = Component::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        component.name = p.as_str().to_string();
      }
      Rule::inline_doc => {
        component.inline_doc = parse_inline_doc(p);
      }
      Rule::attr_decl => {
        component.attributes.push(consume_attribute(p));
      }
      _ => println!("unreachable component rule: {:?}", p.as_rule())
    };
  }
  return component;
}

fn consume_attribute(pair: Pair<Rule>) -> Attribute {
  let mut attribute = Attribute::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        attribute.key = p.as_str().to_string();
      }
      Rule::attr_value => {
        attribute.value = consume_attr_value(p);
      }
      _ => println!("unreachable attribute rule: {:?}", p.as_rule())
    };
  }
  return attribute;
}

fn consume_attr_value(pair: Pair<Rule>) -> String {
  let mut value = String::new();
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        value = p.as_str().to_string();
      }
      Rule::string => {
        value = parse_string(p.as_str());
      }
      _ => println!("unreachable attr_value rule: {:?}", p.as_rule())
    };
  }
  return value;
}

fn parse_string(str: &str) -> String {
  let mut s = str.to_string();
  s.remove(0);
  s.remove(s.len() - 1);
  return s;
}

fn parse_inline_doc(pair: Pair<Rule>) -> String {
  let len = "\"\"\"".len();
  return pair.as_str().chars().skip(len).take(pair.as_str().len() - len * 2).collect();
}

#[cfg(test)]
mod tests {
  use crate::parser::ast::{Aggregate, ContextRelation, BoundedContext, ContextMap, Entity, Field, FklDeclaration, ValueObject, Component, ComponentType, Attribute};
  use crate::parser::ast::RelationDirection::{PositiveDirected, BiDirected};
  use crate::parser::parser::parse;

  #[test]
  fn parse_context_map() {
    let decls = parse(r#"
ContextMap {
  ShoppingCarContext -> MallContext;
  ShoppingCarContext <-> MallContext;
}

Context ShoppingCarContext {

}
"#).unwrap();

    assert_eq!(decls[0], FklDeclaration::ContextMap(ContextMap {
      name: "".to_string(),
      state: Default::default(),
      contexts: vec![
        BoundedContext {
          name: "MallContext".to_string(),
          aggregates: vec![],
        },
        BoundedContext {
          name: "ShoppingCarContext".to_string(),
          aggregates: vec![],
        },
      ],
      relations: vec![
        ContextRelation { source: "ShoppingCarContext".to_string(), target: "MallContext".to_string(), connection_type: PositiveDirected, source_type: None, target_type: None },
        ContextRelation { source: "ShoppingCarContext".to_string(), target: "MallContext".to_string(), connection_type: BiDirected, source_type: None, target_type: None },
      ],
    }));
  }

  #[test]
  fn long_string() {
    let decls = parse(r#"
Aggregate Sample {
  """ inline doc sample
just for test
"""
}
"#).unwrap();

    assert_eq!(decls[0], FklDeclaration::Aggregate(Aggregate {
      name: "Sample".to_string(),
      description: "".to_string(),
      is_root: false,
      inline_doc: r#" inline doc sample
just for test
"#.to_string(),
      used_context: "".to_string(),
      entities: vec![],
      value_objects: vec![],
    }));
  }

  #[test]
  fn aggregate() {
    let decls = parse(r#"
Aggregate ShoppingCart {
  Entity Product {
    constructor(name: String, price: Money)
  }
}
"#).unwrap();

    assert_eq!(decls[0], FklDeclaration::Aggregate(Aggregate {
      name: "ShoppingCart".to_string(),
      description: "".to_string(),
      is_root: false,
      inline_doc: "".to_string(),
      used_context: "".to_string(),
      entities: vec![Entity {
        is_aggregate_root: false,
        name: "Product".to_string(),
        identify: Default::default(),
        inline_doc: "".to_string(),
        fields: vec![
          Field {
            name: "name".to_string(),
            field_type: "String".to_string(),
          },
          Field {
            name: "price".to_string(),
            field_type: "Money".to_string(),
          }],
        value_objects: vec![],
      }],
      value_objects: vec![],
    }))
  }

  #[test]
  fn full_sample() {
    parse("
ContextMap {
  SalesContext <-> SalesContext;
}

Context SalesContext {
  Aggregate SalesOrder {
    Entity SalesOrderLine {
      constructor(product: Product, quantity: Quantity)
    }
  }
}

Entity Opportunity {
  constructor(
    id: String,
    name: String,
    description: String,
    status: OpportunityStatus,
    amount: Money,
    probability: Probability,
    closeDate: Date,
    contacts: Vec<Contact>,
    products: Vec<Product>,
    notes: Vec<Note>,
    attachments: Vec<Attachment>,
    activities: Vec<Activity>,
    tasks: Vec<Task>,
    events: Vec<Event>,
    created: DateTime,
    createdBy: String,
    modified: DateTime,
    modifiedBy: String
  )
}

Entity Pipeline {
  constructor(
    id: String,
    name: String,
    description: String,
    stages: Vec<Stage>,
    opportunities: Vec<Opportunity>,
    created: DateTime,
    createdBy: String,
    modified: DateTime,
    modifiedBy: String
  )
}

Entity Contact {
  constructor(
    id: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    title: String,
    department: String,
    account: Account,
    address: Address,
    created: DateTime,
    createdBy: String,
    modified: DateTime,
    modifiedBy: String,
  )
}

Entity Account {
  constructor(
    id: String,
    name: String,
    website: String,
    phone: String,
    industry: String,
    employees: String,
    annualRevenue: Money,
    billingAddress: Address,
    shippingAddress: Address,
    contacts: Vec<Contact>,
    created: DateTime,
    createdBy: String,
    modified: DateTime,
    modifiedBy: String,
  )
}

Entity Product {
  constructor(
    id: String,
    name: String,
    description: String,
    price: Money,
    category: String,
    created: DateTime,
    createdBy: String,
    modified: DateTime,
    modifiedBy: String,
  )
}

Entity Territory {
  constructor(
    id: String,
    name: String,
    description: String,
    created: DateTime,
    createdBy: String,
    modified: DateTime,
    modifiedBy: String,
  )
}

Entity SalesPerson {
  constructor(
    id: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    title: String,
    department: String,
    account: Account,
    address: Address,
    territories: Vec<Territory>,
    created: DateTime,
    createdBy: String,
    modified: DateTime,
    modifiedBy: String,
  )
}
").unwrap();
  }

  #[test]
  fn basic_vo_inline_aggregate() {
    let decls = parse(r#"Context Cart {
  Aggregate Cart {
    Entity Cart {
      ValueObject CartId
      ValueObject CartStatus
      ValueObject CartItem
      ValueObject CartItemQuantity
      ValueObject CartItemPrice
      ValueObject CartItemTotal
      ValueObject CartTotal
    }
  }
}"#).unwrap();

    assert_eq!(decls[0], FklDeclaration::BoundedContext(BoundedContext {
      name: "Cart".to_string(),
      aggregates: vec![
        Aggregate {
          name: "Cart".to_string(),
          description: "".to_string(),
          is_root: false,
          inline_doc: "".to_string(),
          used_context: "".to_string(),
          entities: vec![Entity {
            is_aggregate_root: false,
            name: "Cart".to_string(),
            identify: Default::default(),
            inline_doc: "".to_string(),
            fields: vec![],
            value_objects: vec![
              ValueObject {
                name: "CartId".to_string(),
                inline_doc: "".to_string(),
                fields: vec![],
              },
              ValueObject {
                name: "CartStatus".to_string(),
                inline_doc: "".to_string(),
                fields: vec![],
              },
              ValueObject {
                name: "CartItem".to_string(),
                inline_doc: "".to_string(),
                fields: vec![],
              },
              ValueObject {
                name: "CartItemQuantity".to_string(),
                inline_doc: "".to_string(),
                fields: vec![],
              },
              ValueObject {
                name: "CartItemPrice".to_string(),
                inline_doc: "".to_string(),
                fields: vec![],
              },
              ValueObject {
                name: "CartItemTotal".to_string(),
                inline_doc: "".to_string(),
                fields: vec![],
              },
              ValueObject {
                name: "CartTotal".to_string(),
                inline_doc: "".to_string(),
                fields: vec![],
              },
            ],
          }],
          value_objects: vec![],
        }
      ],
    }));
  }

  #[test]
  fn bind_api() {
    let decls = parse(r#"
Component SalesComponent {
  name = 'Sample Phodal';
  type: Application;
  // Aggregate SalesOrder;
}
"#);

    assert_eq!(decls.unwrap()[0], FklDeclaration::Component(Component {
      name: "SalesComponent".to_string(),
      inline_doc: "".to_string(),
      component_type: ComponentType::Application,
      attributes: vec![
        Attribute {
          key: "name".to_string(),
          value: "Sample Phodal".to_string(),
        }, Attribute {
          key: "type".to_string(),
          value: "Application".to_string(),
        },
      ],
    }));
  }
}
