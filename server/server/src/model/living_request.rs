use std::ops::Range;
use diamond_types::LocalVersion;

use serde::Deserialize;
use serde::Serialize;

use crate::model::RoomId;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct InsertAction {
  pub room_id: RoomId,
  pub content: String,
  pub pos: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreateRoom {
  pub agent_name: Option<String>,
  pub content: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct JoinRoom {
  pub agent_name: Option<String>,
  pub room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct LeaveRoom {
  pub room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeleteAction {
  pub range: Range<usize>,
  pub room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct UpdateByVersion {
  pub room_id: RoomId,
  pub version: LocalVersion,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct OpsByPatches {
  pub room_id: RoomId,
  pub patches: Vec<u8>,
  pub agent_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type", content = "value")]
pub enum ActionType {
  CreateRoom(CreateRoom),
  JoinRoom(JoinRoom),
  LeaveRoom(LeaveRoom),
  Delete(DeleteAction),
  Insert(InsertAction),
  UpdateByVersion(UpdateByVersion),
  OpsByPatches(OpsByPatches),
}

#[cfg(test)]
mod tests {
  use crate::model::{ActionType, CreateRoom, DeleteAction, InsertAction, JoinRoom};

  #[test]
  fn insert_action() {
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
      content: Some("hello".to_string()),
    });
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"CreateRoom","value":{"agent_name":"agent","input":"hello"}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::CreateRoom(CreateRoom {
      agent_name: Some("agent".to_string()),
      content: Some("hello".to_string()),
    }));
  }

  #[test]
  fn delete_action() {
    let action = ActionType::Delete(DeleteAction {
      range: 0..1,
      room_id: "room".to_string(),
    });
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"Delete","value":{"range":{"start":0,"end":1},"room_id":"room"}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::Delete(DeleteAction {
      range: 0..1,
      room_id: "room".to_string(),
    }));
  }

  #[test]
  fn join_room() {
    let action = ActionType::JoinRoom(JoinRoom {
      agent_name: Some("agent".to_string()),
      room_id: "room".to_string(),
    });
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"JoinRoom","value":{"agent_name":"agent","room_id":"room"}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::JoinRoom(JoinRoom {
      agent_name: Some("agent".to_string()),
      room_id: "room".to_string(),
    }));
  }
}
