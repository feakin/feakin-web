use std::ops::Range;

use diamond_types::list::OpLog;
use diamond_types::{AgentId, LocalVersion, Time};
use diamond_types::list::encoding::ENCODE_PATCH;

pub struct LiveCoding {
  inner: OpLog,
  agent_id: Option<AgentId>,
}

impl LiveCoding {
  fn new(content: &str, agent_name: Option<&str>) -> Result<Self, String> {
    let mut oplog = OpLog::new();
    let agent = oplog.get_or_create_agent_id(&agent_name.ok_or("root").unwrap());
    oplog.add_insert(agent, 0, &content);

    let live_coding = Self { inner: oplog, agent_id: Some(agent) };
    Ok(live_coding)
  }

  fn add_client(&mut self, agent_name: &str) -> LocalVersion {
    self.inner.get_or_create_agent_id(agent_name);
    self.inner.local_version()
  }

  fn insert(&mut self, agent_name: &str, pos: usize, content: &str) {
    let agent = self.inner.get_or_create_agent_id(agent_name);
    self.inner.add_insert(agent, pos, content);
  }

  fn delete(&mut self, agent_name: &str, range: Range<usize>) {
    let agent = self.inner.get_or_create_agent_id(agent_name);
    self.inner.add_delete_without_content(agent, range);
  }

  fn encode_from_version(&self, version: &[Time]) -> Vec<u8> {
    let bytes = self.inner.encode_from(ENCODE_PATCH, version);
    bytes
  }
}

#[cfg(test)]
mod tests {
  use crate::living::live_coding::LiveCoding;

  #[test]
  fn simulate_insert() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut coding = LiveCoding::new("abcdef", Some("root")).unwrap();

    coding.insert(agent1, 2, "zero");
    coding.insert(agent1, 5, "zero");

    let version = coding.add_client(agent2);

    assert_eq!(version.len(), 1);
    let branch = coding.inner.checkout(&version);
    assert_eq!(branch.content().to_string(), "abzerzeroocdef");
  }

  #[test]
  fn simulate_delete() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut live = LiveCoding::new("abcdef", Some("root")).unwrap();

    live.insert(agent1, 2, "zero");

    live.add_client(agent2);
    live.delete(agent2, 2..8);

    let local = live.inner.local_version();
    let branch = live.inner.checkout(&local);

    assert_eq!(branch.content().to_string(), "abef");
  }

  #[test]
  fn patch_history() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut live = LiveCoding::new("abcdef", Some("root")).unwrap();

    live.insert(agent1, 2, "zero");

    let history_version = live.add_client(agent2);

    live.delete(agent2, 2..8);

    let local = live.inner.local_version();
    let branch = live.inner.checkout(&local);

    let bytes = live.encode_from_version(&history_version);
    // assert_eq!(String::from_utf8_lossy(&bytes), "abef".to_string());
    assert!(bytes.len() > 0);
  }
}
