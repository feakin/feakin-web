#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub enum DomainObjectType {
  ApplicationService,
  AggregateRoot,
  DomainEvent,
  Entity,
  ValueObject,
}

impl Default for DomainObjectType {
  fn default() -> Self {
    DomainObjectType::ValueObject
  }
}

pub trait DomainObject {
  fn name(&self) -> &str;
  fn inline_doc(&self) -> &str;
  fn object_type(&self) -> DomainObjectType;
}
