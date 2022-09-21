extern crate pest;
#[macro_use]
extern crate pest_derive;

pub mod parser;
mod model;

mod tactic;
mod strategy;
// implementation-binding
mod binding;

pub use parser::parse;
pub use parser::ast;
