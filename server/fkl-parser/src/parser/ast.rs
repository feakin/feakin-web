use std::collections::HashMap;
use serde::Deserialize;
use serde::Serialize;

// strategy DDD

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum FklDeclaration {
  None,
  ContextMap(ContextMap),
  BoundedContext(BoundedContext),
  Domain(Domain),
  Aggregate(Aggregate),
  DomainService(DomainService),
  ApplicationService(ApplicationService),
  Entity(Entity),
  ValueObject(ValueObject),
  Component(Component),
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
  pub display_name: String,
  pub context_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Domain {
  pub name: String,
  pub description: String,
  pub sub_domains: Vec<SubDomain>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct SubDomain {
  pub name: String,
  pub subdomain_type: SubDomainType,
  pub entities: Vec<Entity>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum SubDomainType {
  Core,
  Generic,
  Supporting,
}

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
  pub aggregates: Vec<Aggregate>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct ContextRelation {
  pub source: String,
  pub target: String,
  pub connection_type: RelationDirection,
  pub source_type: Option<ContextRelationType>,
  pub target_type: Option<ContextRelationType>,
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
pub struct DomainService {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ApplicationService {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct Aggregate {
  pub name: String,
  pub description: String,
  pub is_root: bool,
  pub inline_doc: String,
  pub used_context: String,
  pub entities: Vec<Entity>,
  pub value_objects: Vec<ValueObject>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DomainEvent {
  pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct Entity {
  // Aggregate Root
  pub is_aggregate_root: bool,
  pub name: String,
  pub identify: Field,
  pub inline_doc: String,
  pub fields: Vec<Field>,
  pub value_objects: Vec<ValueObject>,
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
pub struct ValueObject {
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
pub struct Trait {
  pub name: String,
  pub description: String,
  pub parameters: Vec<Parameter>,
  pub return_type: Vec<Parameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
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
pub struct Component {
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
