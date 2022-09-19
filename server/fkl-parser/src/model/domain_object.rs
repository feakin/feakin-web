pub enum DomainObjectType {
  ApplicationService,
  AggregateRoot,
  DomainEvent,
  Entity,
  ValueObject,
}

pub trait DomainObject {
  fn name(&self) -> &str;
  fn inline_doc(&self) -> &str;
  fn object_type(&self) -> DomainObjectType;
}
