#[derive(Clone)]
pub struct Node {
  name: String,
  label: String,
}

impl Node {
  pub fn new(name: &str) -> Self {
    Node { name: name.to_string(), label: name.to_string() }
  }

  pub(crate) fn to_dot(&self) -> String {
    format!("{} [label=\"{}\"]", self.name, self.label)
  }
}
