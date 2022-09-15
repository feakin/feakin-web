use std::collections::HashMap;
use pest::iterators::{Pair, Pairs};

use crate::parser::ast::{Aggregate, BoundedContext, ContextMap, FklDeclaration};
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
        Rule::aggregate_decl => {
          decl = FklDeclaration::Aggregate(consume_aggregate(p));
        }
        Rule::context_decl => {
          decl = FklDeclaration::BoundedContext(consume_context(p));
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
  for p in pair.into_inner() {
    match p.as_rule() {
      Rule::identifier => {
        context_name = p.as_str().to_string();
      }
      Rule::context_node_rel => {
        for p in p.into_inner() {
          match p.as_rule() {
            Rule::identifier => {
              let context_name = p.as_str().to_string();
              context_decl_map.insert(context_name.clone(), BoundedContext {
                name: context_name,
                aggregates: vec![],
              });
            }
            _ => println!("unreachable content rule: {:?}", p.as_rule())
          };
        }
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
    contexts,
    relations: vec![],
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
      _ => println!("unreachable aggregate rule: {:?}", p.as_rule())
    };
  }
  return aggregate;
}

fn parse_inline_doc(pair: Pair<Rule>) -> String {
  let mut doc = String::new();
  // remove """ from the beginning and end
  pair.as_str().chars().skip(3).take(pair.as_str().len() - 6).for_each(|c| {
    doc.push(c);
  });
  return doc;
}

#[cfg(test)]
mod tests {
  use crate::parser::ast::{Aggregate, BoundedContext, ContextMap, FklDeclaration};
  use crate::parser::parser::parse;

  #[test]
  fn parse_context_map() {
    let decls = parse(r#"
ContextMap {
  ShoppingCarContext -> MallContext;
  ShoppingCarContext <-> MallContext;
}

Context ShoppingCarContext {
  Module Cargo { }
}
"#).unwrap();

    assert_eq!(decls[0], FklDeclaration::ContextMap(ContextMap {
      name: "".to_string(),
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
      relations: vec![],
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
    }));
  }

  #[test]
  fn aggregate() {
    parse(r#"
Context ShoppingCarContext {
  Aggregate ShoppingCart {
    Entity Product {
      constructor(name: String, price: Money)
    }
  }
}
"#).unwrap();
  }


  #[test]
  fn full_sample() {
    parse("
ContextMap {
  SalesContext <-> SalesContext;
}

Context SalesContext {
  Module Sales {
    Aggregate SalesOrder {
      Entity SalesOrderLine {
        constructor(product: Product, quantity: Quantity)
      }
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
    parse(r#"Context Cart {
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
  }
}
