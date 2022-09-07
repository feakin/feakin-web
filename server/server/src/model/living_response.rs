use serde::Deserialize;
use serde::Serialize;

use crate::model::{ConnId, RemoteVersion, RoomId};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct JoinResponse {
  pub room_id: RoomId,
  pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreateResponse {
  pub room_id: RoomId,
  pub conn_id: ConnId,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeleteResponse {
  pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct InsertResponse {
  pub message: String,
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
  CreateResponse(CreateResponse),
  JoinResponse(JoinResponse),
  Delete(String),
  Insert(String),
  Upstream(UpstreamResponse),
  Message(String),
  SystemMessage(String),
}

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
}
