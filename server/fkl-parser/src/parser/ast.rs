use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ContextMap {
  pub name: String,
  pub contexts: BoundedContext,
  pub relations: Vec<BoundedContextRelation>
}


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct BoundedContext {
  pub name: String,
}

// BoundedContextRelation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum BoundedContextRelation {
  // Symmetric relation
  SharedKernel,
  Partnership,
  // Upstream Downstream
  CustomerSupplier,
  GenericUpstreamDownstream,
  // SeparateWay,
  Conformist,
  AntiCorruptionLayer,
  OpenHostService,
  PublishedLanguage,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Aggregate {
  pub name: String,
  pub is_root: bool,
  pub context: String,
  pub entities: Vec<Entity>
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DomainCommand {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DomainEvent {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct  Entity {
  pub name: String,
  pub fields: Vec<Field>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct  Field {
  pub name: String,
  pub type_: String,
}
