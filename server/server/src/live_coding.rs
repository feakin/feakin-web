use diamond_types::list::{OpLog};
use diamond_types::list::encoding::ENCODE_FULL;
use diamond_types::LocalVersion;

struct LiveCoding {
  oplog: OpLog,
}

impl LiveCoding {
  fn new(content: &str, agent_name: Option<&str>) -> Result<Self, String> {
    let mut oplog = OpLog::new();
    let agent = oplog.get_or_create_agent_id(&agent_name.ok_or("root").unwrap());
    oplog.add_insert(agent, 0, &content);

    let live_coding = Self { oplog };
    Ok(live_coding)
  }

  fn add_agent(&mut self, agent_name: &str) -> LocalVersion {
    self.oplog.get_or_create_agent_id(agent_name);
    self.oplog.local_version()
  }

  fn insert(&mut self, agent_name: &str, pos: usize, content: &str) {
    let agent = self.oplog.get_or_create_agent_id(agent_name);
    self.oplog.add_insert(agent, pos, content);
    self.oplog.encode(ENCODE_FULL);
  }
}

#[cfg(test)]
mod tests {
  use crate::live_coding::LiveCoding;

  #[test]
  fn it_works() {
    let agent1 = "phodal";
    let agent2 = "hello";

    let mut coding = LiveCoding::new("abcdef", Some("root")).unwrap();

    coding.insert(agent1, 2, "zero");
    coding.insert(agent1, 5, "zero");

    let version = coding.add_agent(agent2);

    assert_eq!(version.len(), 1);
    let branch = coding.oplog.checkout(&version);
    assert_eq!(branch.content().to_string(), "abzerzeroocdef");
  }
}
