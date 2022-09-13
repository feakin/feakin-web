use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ContextMap {
  pub name: String,
  pub contexts: FkContext,
  pub relations: Vec<BoundedContextRel>
}


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct FkContext {
  pub name: String,
}

// BoundedContextRelation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum BoundedContextRel {
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
