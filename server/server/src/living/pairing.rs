pub trait Pairing<T> {
  fn add_client(&mut self, agent_name: &str) -> T;
  fn insert(&mut self, agent_name: &str, pos: usize, content: &str);
}
