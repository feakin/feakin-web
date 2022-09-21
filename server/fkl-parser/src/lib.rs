extern crate pest;
#[macro_use]
extern crate pest_derive;

pub mod parser;
mod mir;

// implementation-binding dsl
mod binding;

pub use parser::parse;
pub use parser::ast;
