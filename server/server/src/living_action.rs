use std::ops::Range;
use serde::Serialize;
use serde::Deserialize;

/// Connection ID.
pub type ConnId = usize;

/// Room ID.
pub type RoomId = String;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct InsertAction {
  content: String,
  range: Range<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct CreateRoom {
  conn_id: ConnId,
  client_name: String,
  input: Option<String>
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct JoinRoom {
  id: Range<usize>,
  name: String,
  input: Option<String>
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
      content: "hello".to_string(),
      range: 0..5,
    };
    let action = ActionType::Insert(insert);
    let json = serde_json::to_string(&action).unwrap();

    assert_eq!(json, r#"{"type":"Insert","value":{"content":"hello","range":{"start":0,"end":5}}}"#);

    let action: ActionType = serde_json::from_str(&json).unwrap();

    assert_eq!(action, ActionType::Insert(InsertAction {
      content: "hello".to_string(),
      range: 0..5,
    }));
  }
}
