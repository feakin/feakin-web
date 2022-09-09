use std::ops::Range;

use diamond_types::{AgentId, LocalVersion, Time};
use diamond_types::list::encoding::{ENCODE_FULL, ENCODE_PATCH, EncodeOptions};
use diamond_types::list::OpLog;
use log::error;

use crate::model::RemoteVersion;

#[derive(Debug)]
pub struct LiveCoding {
  pub(crate) inner: OpLog,
}

impl LiveCoding {
  pub fn new(agent_name: &str) -> Self {
    let mut oplog = OpLog::new();
    oplog.get_or_create_agent_id(&agent_name);

    Self { inner: oplog }
  }

  pub fn join(&mut self, agent_name: &str) -> AgentId {
    let id = self.inner.get_or_create_agent_id(agent_name);
    id
  }

  pub fn version(&self) -> LocalVersion {
    self.inner.local_version()
  }

  pub fn insert(&mut self, agent_name: &str, pos: usize, content: &str) -> Time {
    if pos > self.inner.len() {
      // catch for error
      error!("insert： pos out of range");
      return self.inner.len();
    }

    if content.is_empty() {
      self.inner.get_or_create_agent_id(agent_name);
      return self.inner.len();
    }

    let agent = self.inner.get_or_create_agent_id(agent_name);
    self.inner.add_insert(agent, pos, content)
  }

  pub fn create(&mut self, agent_name: &str, content: &str) -> Time {
    if content.is_empty() {
      self.inner.get_or_create_agent_id(agent_name);
      return self.inner.len();
    }

    let agent = self.inner.get_or_create_agent_id(agent_name);
    self.inner.add_insert_at(agent, &[], 0, content)
  }

  pub fn delete(&mut self, agent_name: &str, range: Range<usize>) -> Time {
    let agent = self.inner.get_or_create_agent_id(agent_name);
    if range.start > range.end {
      error!("delete： start should < end");
      return self.inner.len();
    }

    if (range.start > self.inner.len()) || (range.end > self.inner.len()) {
      // catch for error
      error!("delete： range out of range");
      return self.inner.len();
    }

    self.inner.add_delete_without_content(agent, range)
  }

  pub fn base_version(&self) -> Vec<u8> {
    let bytes = self.inner.encode_from(EncodeOptions::default(), &[0]);
    bytes
  }

  pub fn content(&self) -> String {
    let branch = self.inner.checkout_tip();
    branch.content().to_string()
  }

  pub fn remote_version(&self) -> RemoteVersion {
    self.inner.remote_version()
  }

  pub fn patch_from_version(&self) -> Vec<u8> {
    let local_version = self.inner.local_version();
    let bytes = self.inner.encode_from(ENCODE_PATCH, &local_version);
    bytes
  }

  fn to_local(&self, time: Time) -> RemoteVersion {
    let version = self.inner.local_to_remote_version(&[time]);
    version
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

    let mut coding = LiveCoding::new("root");
    coding.insert("root", 0, "abcdef");

    coding.insert(agent1, 2, "zero");
    coding.insert(agent1, 5, "zero");

    let _agent = coding.join(agent2);
    let version = coding.version();

    assert_eq!(version.len(), 1);
    let branch = coding.inner.checkout(&version);
    assert_eq!(branch.content().to_string(), "abzerzeroocdef");
  }

  #[test]
  fn simulate_delete() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut live = LiveCoding::new("root");
    live.insert("root", 0, "abcdef");

    live.insert(agent1, 2, "zero");

    live.join(agent2);
    live.delete(agent2, 2..8);

    let local = live.inner.local_version();
    let branch = live.inner.checkout(&local);

    assert_eq!(branch.content().to_string(), "abef");
  }

  #[test]
  fn patch_history() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut live = LiveCoding::new("root");
    live.insert("root", 0, "abcdef");

    live.insert(agent1, 2, "zero");

    live.join(agent2);
    let history_version = live.version();

    live.delete(agent2, 2..8);

    let local = live.inner.local_version();
    live.inner.checkout(&local);

    let bytes = live.encode_from_version(&history_version);
    // assert_eq!(String::from_utf8_lossy(&bytes), "abef".to_string());
    assert!(bytes.len() > 0);
  }

  #[test]
  fn version() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut live = LiveCoding::new("root");
    live.insert("root", 0, "abcdef");

    live.insert(agent1, 2, "zero");

    live.join(agent2);

    let time = live.delete(agent2, 2..8);

    let vec = live.to_local(time);

    assert_eq!(vec.len(), 1);
  }
}
