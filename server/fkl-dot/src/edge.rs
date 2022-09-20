pub struct Edge {
  from: String,
  to: String,
  label: String,
}

impl Edge {
  pub fn new(from: String, to: String, label: String) -> Self {
    Edge { from, to, label }
  }
}
