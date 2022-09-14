pub trait DomainObject {
  fn is_aggregate(&self) -> bool;
}
