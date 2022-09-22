use std::collections::HashMap;
use serde::Deserialize;
use serde::Serialize;

// strategy DDD

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum FklDeclaration {
  None,
  ContextMap(ContextMapDecl),
  BoundedContext(BoundedContextDecl),
  Domain(DomainDecl),
  Aggregate(AggregateDecl),
  Entity(EntityDecl),
  ValueObject(ValueObjectDecl),
  Component(ComponentDecl),
  DomainService(DomainServiceDecl),
  ApplicationService(ApplicationServiceDecl),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct UbiquitousLanguage {
  pub name: String,
  pub description: String,
  // use hashmap to make sure it's unique
  pub words: HashMap<String, UniqueWord>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct UniqueWord {
  pub unique_name: String,
  #[serde(rename(serialize = "displayName", deserialize = "displayName"))]
  pub display_name: String,
  #[serde(rename(serialize = "contextName", deserialize = "contextName"))]
  pub context_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DomainDecl {
  pub name: String,
  pub description: String,
  #[serde(rename(serialize = "subDomains", deserialize = "subDomains"))]
  pub sub_domains: Vec<SubDomain>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct SubDomain {
  pub name: String,
  pub subdomain_type: String,
  pub entities: Vec<BoundedContextDecl>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct ContextMapDecl {
  pub name: String,
  pub contexts: Vec<BoundedContextDecl>,
  pub relations: Vec<ContextRelation>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct BoundedContextDecl {
  pub name: String,
  pub aggregates: Vec<AggregateDecl>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct ContextRelation {
  pub source: String,
  pub target: String,
  pub direction: RelationDirection,
  pub source_type: Option<String>,
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum ContextRelationType {
  // Symmetric relation
  SharedKernel,
  Partnership,
  // Upstream Downstream
  CustomerSupplier,
  Conformist,
  AntiCorruptionLayer,
  OpenHostService,
  PublishedLanguage,
  SeparateWay,
  // added in book "DDD Reference"
  BigBallOfMud,
}

// tactic DDD

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DomainServiceDecl {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ApplicationServiceDecl {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct AggregateDecl {
  pub name: String,
  pub description: String,
  pub is_root: bool,
  pub inline_doc: String,
  pub used_context: String,
  pub entities: Vec<EntityDecl>,
  pub value_objects: Vec<ValueObjectDecl>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DomainEvent {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct EntityDecl {
  pub is_aggregate_root: bool,
  pub name: String,
  pub identify: Field,
  pub inline_doc: String,
  pub fields: Vec<Field>,
  pub value_objects: Vec<ValueObjectDecl>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct Field {
  pub name: String,
  pub field_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct Attribute {
  pub key: String,
  pub value: String,
}

// ???
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Property {
  pub required: bool,
  pub nullable: bool,
  pub unique: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct ValueObjectDecl {
  pub name: String,
  pub inline_doc: String,
  pub fields: Vec<Field>,
}

// Binding To Function

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Parameter {
  pub name: String,
  pub param_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Trait {
  pub name: String,
  pub description: String,
  pub parameters: Vec<Parameter>,
  pub return_type: Vec<Parameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct RestApi {
  pub name: String,
  pub method: HttpMethod,
  pub path: String,
  pub parameters: Vec<Parameter>,
  pub return_type: Vec<Parameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum HttpMethod {
  Get,
  Post,
  Put,
  Delete,
  Patch,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct ComponentDecl {
  pub name: String,
  pub component_type: ComponentType,
  pub inline_doc: String,
  pub attributes: Vec<Attribute>
}

// binding
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ComponentType {
  Application,
  Service,
  Module,
  Package,
  //  or Classes ?
  Entities,
}

impl Default for ComponentType {
  fn default() -> Self {
    ComponentType::Application
  }
}
