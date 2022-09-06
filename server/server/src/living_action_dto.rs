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
pub struct InsertAction {
  pub room_id: RoomId,
  pub content: String,
  pub pos: usize
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreateRoom {
  pub agent_name: Option<String>,
  pub input: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct JoinRoom {
  pub agent_name: Option<String>,
  pub room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeleteAction {
  pub range: Range<usize>,
  pub room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type", content = "value")]
pub enum ActionType {
  CreateRoom(CreateRoom),
  JoinRoom(JoinRoom),
  Delete(DeleteAction),
  Insert(InsertAction),
}

#[cfg(test)]
mod tests {
  use crate::living_action_dto::{ActionType, CreateRoom, InsertAction};

  #[test]
  fn serde_from_string_for_insert() {
    let insert = InsertAction {
      room_id: "".to_string(),
      content: "hello".to_string(),
      pos: 0,
    };
    let action = ActionType::Insert(insert);
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"Insert","value":{"room_id":"","content":"hello","pos":0}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::Insert(InsertAction {
      room_id: "".to_string(),
      content: "hello".to_string(),
      pos: 0,
    }));
  }

  #[test]
  fn create_room() {
    let action = ActionType::CreateRoom(CreateRoom {
      agent_name: Some("agent".to_string()),
      input: Some("hello".to_string()),
    });
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"CreateRoom","value":{"agent_name":"agent","input":"hello"}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::CreateRoom(CreateRoom {
      agent_name: Some("agent".to_string()),
      input: Some("hello".to_string()),
    }));
  }

  #[test]
  fn delete_action() {
    let action = ActionType::Delete(crate::living_action_dto::DeleteAction {
      range: 0..1,
      room_id: "room".to_string(),
    });
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"Delete","value":{"range":{"start":0,"end":1},"room_id":"room"}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::Delete(crate::living_action_dto::DeleteAction {
      range: 0..1,
      room_id: "room".to_string(),
    }));
  }

  #[test]
  fn join_room() {
    let action = ActionType::JoinRoom(crate::living_action_dto::JoinRoom {
      agent_name: Some("agent".to_string()),
      room_id: "room".to_string(),
    });
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"JoinRoom","value":{"agent_name":"agent","room_id":"room"}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::JoinRoom(crate::living_action_dto::JoinRoom {
      agent_name: Some("agent".to_string()),
      room_id: "room".to_string(),
    }));
  }
}
