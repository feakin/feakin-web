use std::fmt;
use std::fmt::{Formatter};

pub struct Edge {
  from: String,
  to: String,
}

impl Edge {
  pub fn new(from: String, to: String) -> Self {
    Edge { from, to }
  }
}

impl fmt::Display for Edge {
  fn fmt(&self, out: &mut Formatter<'_>) -> fmt::Result {
    out.write_str(&format!("{} -> {};", self.from, self.to))
  }
}
