pub trait DomainObject {
  fn is_aggregate_root(&self) -> bool;
}
