extern crate pest;
#[macro_use]
extern crate pest_derive;

pub use parser::parse as ast_parse;

use crate::mir::ContextMap;
use crate::parser::parse_result::ParseError;

pub mod parser;
pub mod mir;

mod binding;

pub fn parse(rule_content: &str) -> Result<ContextMap, ParseError> {
  Ok(mir(rule_content)?)
}

pub fn mir(str: &str) -> Result<ContextMap, ParseError> {
  match ast_parse(str) {
    Ok(decls) => {
      Ok(ContextMap {
        name: "".to_string(),
        state: Default::default(),
        contexts: vec![],
        relations: vec![],
      })
    }
    Err(err) => {
      Err(err)
    }
  }
}

#[cfg(test)]
mod tests {
  use crate::mir;

  #[test]
  fn test_mir() {
    let str = r#"
ContextMap {
  ShoppingCarContext -> MallContext;
  ShoppingCarContext <-> MallContext;
}
"#;
    let result = mir(str);
    println!("{:?}", result);
  }
}
