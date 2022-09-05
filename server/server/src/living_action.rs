use std::ops::Range;
use diamond_types::AgentId;
use rand::{Rng, thread_rng};
use serde::Serialize;
use serde::Deserialize;

pub type RoomId = String;

pub type ConnId = AgentId;

pub fn id_generator() -> u32 {
  thread_rng().gen::<u32>()
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct InsertAction {
  agent_id: AgentId,
  content: String,
  range: Range<usize>,
  room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct CreateRoom {
  agent_id: AgentId,
  agent_name: String,
  input: Option<String>,
  room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct JoinRoom {
  agent_name: String,
  id: Range<usize>,
  input: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct DeleteAction {
  range: Range<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type", content = "value")]
enum ActionType {
  CreateRoom(CreateRoom),
  JoinRoom(JoinRoom),
  Delete(DeleteAction),
  Insert(InsertAction),
}

#[cfg(test)]
mod tests {
  use crate::living_action::{ActionType, InsertAction};

  #[test]
  fn serde_from_string_for_insert() {
    let insert = InsertAction {
      agent_id: 0,
      room_id: "main".to_string(),
      content: "hello".to_string(),
      range: 0..5,
    };
    let action = ActionType::Insert(insert);
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"Insert","value":{"agent_id":0,"content":"hello","range":{"start":0,"end":5},"room_id":"main"}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::Insert(InsertAction {
      agent_id: 0,
      room_id: "main".to_string(),
      content: "hello".to_string(),
      range: 0..5,
    }));
  }
}
