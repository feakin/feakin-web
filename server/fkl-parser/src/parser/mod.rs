use pest::Parser;

mod ast;

#[derive(Parser)]
#[grammar = "parser/fkl.pest"]
pub struct FklParser;


fn parse(code: &str) {
  let pairs = FklParser::parse(Rule::declarations, code).unwrap_or_else(|e| panic!("{}", e));
  for pair in pairs {
    // A pair is a combination of the rule which matched and a span of input
    println!("Rule:    {:?}", pair.as_rule());
    println!("Span:    {:?}", pair.as_span());
    println!("Text:    {}", pair.as_str());
  }
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
");
  }

  #[test]
  fn long_string() {
    parse(r#"
Aggregate {
  """ inline doc sample
just for test
"""
}
"#);
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
"#);
  }
}
