use pest::{Parser};
use pest::iterators::Pairs;
use crate::parser::ast::{ContextMap, FklDeclaration};
use crate::parser::parse_result::ParseError;

mod ast;
mod parse_result;

#[derive(Parser)]
#[grammar = "parser/fkl.pest"]
pub struct FklParser;

fn parse(code: &str) -> Result<Vec<FklDeclaration>, ParseError> {
  match FklParser::parse(Rule::declaration, code) {
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
        _ => println!("unreachable content rule: {:?}", p.as_rule())
      };
    }
    return decl;
  }).collect::<Vec<FklDeclaration>>()
}

fn consume_context_map(pair: pest::iterators::Pair<Rule>) -> ContextMap {
  let mut context_map = Default::default();
  for p in pair.into_inner() {
    match p.as_rule() {
      _ => println!("unreachable content rule: {:?}", p.as_rule())
    };
  }
  return context_map;
}

#[cfg(test)]
mod tests {
  use crate::parser::{parse};

  #[test]
  fn it_works() {
    parse("
ContextMap {
  ShoppingCarContext -> MallContext;
  ShoppingCarContext <-> MallContext;
}

Context ShoppingCarContext {
  Module Cargo { }
}

Module ExtCargo { }
").expect("TODO: panic message");
  }

  #[test]
  fn long_string() {
    parse(r#"
Aggregate Sample {
  """ inline doc sample
just for test
"""
}
"#).expect("TODO: panic message");
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
"#).expect("TODO: panic message");
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
");
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
}"#).expect("TODO: panic message");
  }
}
