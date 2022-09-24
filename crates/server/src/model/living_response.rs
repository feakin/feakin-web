use diamond_types::LocalVersion;
use serde::Deserialize;
use serde::Serialize;

use crate::model::{RoomId};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct JoinResponse {
  pub success: bool,
  pub error_msg: Option<String>,
  pub room_id: RoomId,
  pub content: Vec<u8>,
  pub agent_id: String,
  pub agent_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreateResponse {
  pub room_id: RoomId,
  pub content: Vec<u8>,
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
  pub before: LocalVersion,
  pub after: LocalVersion,
  pub patch: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct PatchesResponse {
  pub patches: Vec<u8>,
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
  Patches(PatchesResponse),
  Message(String),
  SystemMessage(String),
}

impl FkResponse {
  pub fn system_message(msg: String) -> Self {
    FkResponse::SystemMessage(msg)
  }

  pub fn upstream(before: LocalVersion, after: LocalVersion, patch: Vec<u8>) -> Self {
    FkResponse::Upstream(UpstreamResponse {
      before,
      after,
      patch,
    })
  }

  pub(crate) fn delete(version: Option<LocalVersion>) -> Self {
    FkResponse::Delete(DeleteResponse {
      success: version.is_some(),
    })
  }

  pub(crate) fn insert(version: Option<LocalVersion>) -> Self {
    FkResponse::Insert(InsertResponse {
      success: version.is_some(),
    })
  }

  pub(crate) fn join(room_id: String, content: Vec<u8>, agent_id: String, error_msg: Option<String>, agent_name: String) -> Self {
    FkResponse::Join(JoinResponse {
      success: error_msg.is_none(),
      error_msg,
      room_id,
      content,
      agent_id,
      agent_name
    })
  }

  pub(crate) fn create(room_id: String, content: Vec<u8>) -> Self {
    FkResponse::CreateRoom(CreateResponse {
      room_id,
      content
    })
  }

  pub(crate) fn leave() -> Self {
    FkResponse::Message("leave".to_string())
  }


  pub(crate) fn patch(patches: Vec<u8>) -> FkResponse {
    FkResponse::Patches(PatchesResponse {
      patches,
    })
  }
}
