use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ContextMap {
  pub name: String,
  pub contexts: FkContext,
  pub relations: Vec<CtRelation>
}


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct FkContext {
  pub name: String,
}


