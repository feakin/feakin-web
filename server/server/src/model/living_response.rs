use serde::Deserialize;
use serde::Serialize;

use crate::model::{RemoteVersion, RoomId};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct JoinResponse {
  pub success: bool,
  pub error_msg: Option<String>,
  pub room_id: RoomId,
  pub content: String,
  pub agent_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreateResponse {
  pub room_id: RoomId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeleteResponse {
  pub success: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct InsertResponse {
  pub success: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct UpstreamResponse {
  pub version: RemoteVersion,
  pub patch: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type", content = "value")]
pub enum FkResponse {
  // TODO: add alias, like join,create,del,ins,msg ?
  CreateRoom(CreateResponse),
  Join(JoinResponse),
  Delete(DeleteResponse),
  Insert(InsertResponse),
  Upstream(UpstreamResponse),
  Message(String),
  SystemMessage(String),
}

impl FkResponse {}

impl FkResponse {
  pub fn system_message(msg: String) -> Self {
    FkResponse::SystemMessage(msg)
  }

  pub fn upstream(version: RemoteVersion, patch: Vec<u8>) -> Self {
    FkResponse::Upstream(UpstreamResponse {
      version,
      patch,
    })
  }

  pub(crate) fn delete(content: Option<String>) -> Self {
    FkResponse::Delete(DeleteResponse {
      success: content.is_some(),
    })
  }

  pub(crate) fn insert(content: Option<String>) -> Self {
    FkResponse::Insert(InsertResponse {
      success: content.is_some(),
    })
  }

  pub(crate) fn join(room_id: String, content: String, agent_id: String, error_msg: Option<String>) -> Self {
    FkResponse::Join(JoinResponse {
      success: error_msg.is_none(),
      error_msg,
      room_id,
      content,
      agent_id,
    })
  }

  pub(crate) fn create(room_id: String) -> Self {
    FkResponse::CreateRoom(CreateResponse {
      room_id,
    })
  }
}
