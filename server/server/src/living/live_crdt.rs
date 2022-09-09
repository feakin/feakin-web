use diamond_types::AgentId;
use diamond_types::list::ListCRDT;

pub struct LiveCrdt {
  pub(crate) inner: ListCRDT,
}

impl LiveCrdt  {
  pub fn new(agent_name: &str) -> Self {
    let mut crdt = ListCRDT::new();
    crdt.get_or_create_agent_id(&agent_name);

    Self { inner: crdt }
  }

  pub fn join(&mut self, agent_name: &str) -> AgentId {
    let id = self.inner.get_or_create_agent_id(agent_name);
    id
  }
}
