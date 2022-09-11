use std::ops::Range;

use diamond_types::{AgentId, LocalVersion, Time};
use diamond_types::list::{OpLog};
use diamond_types::list::encoding::{ENCODE_PATCH, EncodeOptions};
use diamond_types::list::encoding::encode_tools::ParseError;
use log::error;

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
    self.inner.get_or_create_agent_id(agent_name)
  }

  pub fn create(&mut self, agent_name: &str, content: &str) -> Option<Time> {
    if content.is_empty() {
      self.inner.get_or_create_agent_id(agent_name);
      return None;
    }

    let agent = self.inner.get_or_create_agent_id(agent_name);
    let time = self.inner.add_insert_at(agent, &[], 0, content);
    Some(time)
  }

  pub fn insert(&mut self, pos: usize, content: &str, agent_name: &str) -> Option<Time> {
    if pos > self.inner.len() {
      error!("insert： pos out of range");
      return None;
    }

    if content.is_empty() {
      error!("insert： pos out of range");
      self.inner.get_or_create_agent_id(agent_name);
      return None;
    }

    let agent = self.inner.get_or_create_agent_id(agent_name);
    let time = self.inner.add_insert(agent, pos, content);
    Some(time)
  }

  pub fn delete(&mut self, range: Range<usize>, agent_name: &str) -> Option<Time> {
    let agent = self.inner.get_or_create_agent_id(agent_name);
    if range.start > range.end {
      error!("delete： start should < end");
      return None;
    }

    if (range.start > self.inner.len()) || (range.end > self.inner.len()) {
      // catch for error
      error!("delete： range out of range");
      return None;
    }

    let time = self.inner.add_delete_without_content(agent, range);
    Some(time)
  }

  pub fn bytes(&self) -> Vec<u8> {
    let bytes = self.inner.encode(EncodeOptions::default());
    bytes
  }

  pub fn content(&self) -> String {
    let branch = self.inner.checkout_tip();
    branch.content().to_string()
  }

  pub fn version(&self) -> LocalVersion {
    self.inner.local_version()
  }

  pub fn patch_since(&self, version: &LocalVersion) -> Vec<u8> {
    let bytes = self.inner.encode_from(ENCODE_PATCH, &version);
    bytes
  }

  pub fn apply_patch(&mut self, patches: Vec<u8>) -> Result<LocalVersion, ParseError> {
    self.inner.decode_and_add(&patches)
  }
}

#[cfg(test)]
mod tests {
  use diamond_types::list::OpLog;

  use crate::living::live_coding::LiveCoding;

  #[test]
  fn simulate_insert() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut coding = LiveCoding::new("root");
    coding.insert(0, "abcdef", "root");

    coding.insert(2, "zero", agent1);
    coding.insert(5, "zero", agent1);

    let _agent = coding.join(agent2);
    let version = coding.inner.local_version();

    assert_eq!(version.len(), 1);
    let branch = coding.inner.checkout(&version);
    assert_eq!(branch.content().to_string(), "abzerzeroocdef");
  }

  #[test]
  fn simulate_delete() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut live = LiveCoding::new("root");
    live.insert(0, "abcdef", "root");

    live.insert(2, "zero", agent1);

    live.join(agent2);
    live.delete(2..8, agent2);

    let local = live.inner.local_version();
    let branch = live.inner.checkout(&local);

    assert_eq!(branch.content().to_string(), "abef");
  }

  #[test]
  fn patch_by_version() {
    let mut live = LiveCoding::new("root");
    live.insert(0, "abcdef", "root");
    let v1 = live.version();
    live.insert(0, " ", "root");
    live.version();

    let vec = live.patch_since(&v1);
    assert_eq!(vec.len(), 55);
  }

  #[test]
  fn test_bytes() {
    let mut live = LiveCoding::new("root");
    live.create("root", "efg");

    live.insert(2, "abcdef", "root");
    let vec = live.bytes();

    assert_eq!(vec.len(), 59);

    let log = OpLog::load_from(&vec).unwrap();

    assert_eq!(log.len(), 9);

    let data: Vec<u8> = vec![68, 77, 78, 68, 84, 89, 80, 83, 0, 5, 168, 1, 210, 1, 242, 19, 100, 105, 103, 114, 97, 112, 104, 32, 71, 32, 123, 10, 32, 32, 99, 111, 109, 112, 111, 117, 110, 100, 61, 116, 114, 117, 101, 59, 10, 32, 32, 115, 117, 98, 32, 0, 129, 99, 108, 117, 115, 116, 101, 114, 48, 39, 0, 240, 29, 32, 32, 97, 32, 91, 115, 104, 97, 112, 101, 61, 34, 116, 114, 105, 97, 110, 103, 108, 101, 34, 44, 32, 102, 105, 108, 108, 99, 111, 108, 111, 114, 61, 114, 101, 100, 44, 32, 115, 116, 121, 108, 101, 61, 21, 0, 48, 101, 100, 93, 77, 0, 53, 32, 32, 98, 55, 0, 131, 100, 105, 97, 109, 111, 110, 100, 34, 25, 0, 98, 97, 32, 45, 62, 32, 98, 12, 0, 16, 99, 12, 0, 16, 100, 12, 0, 31, 125, 130, 0, 0, 19, 49, 130, 0, 16, 101, 38, 0, 16, 103, 38, 0, 3, 12, 0, 128, 102, 59, 10, 32, 32, 125, 10, 125, 1, 8, 3, 6, 5, 97, 103, 101, 110, 116, 10, 0, 20, 26, 24, 10, 0, 14, 3, 4, 210, 1, 25, 2, 165, 3, 21, 3, 2, 210, 1, 22, 2, 145, 13, 23, 3, 210, 1, 1, 100, 4, 121, 11, 14, 241];
    let log = OpLog::load_from(&data).unwrap();
    assert_eq!(log.len(), 210);
  }
}
