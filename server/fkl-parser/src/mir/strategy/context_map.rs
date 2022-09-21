use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct ContextMap {
  pub name: String,
  pub state: ContextState,
  pub contexts: Vec<BoundedContext>,
  pub relations: Vec<ContextRelation>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ContextState {
  AsIs,
  ToBe,
}

impl Default for ContextState {
  fn default() -> Self {
    ContextState::ToBe
  }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct BoundedContext {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct ContextRelation {
  pub source: String,
  pub target: String,
  #[serde(rename(serialize = "contextRelationType", deserialize = "contextRelationType"))]
  pub connection_type: RelationDirection,
  #[serde(rename(serialize = "sourceType", deserialize = "sourceType"))]
  pub source_type: Option<String>,
  #[serde(rename(serialize = "targetType", deserialize = "targetType"))]
  pub target_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum RelationDirection {
  Undirected,
  // -->
  PositiveDirected,
  // <--
  NegativeDirected,
  // <->
  BiDirected,
}

impl Default for RelationDirection {
  fn default() -> Self {
    RelationDirection::Undirected
  }
}
