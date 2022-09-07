use std::ops::Range;
use tokio::sync::{mpsc, oneshot};
use crate::model::{ConnId, CreateResponse, DeleteResponse, FkResponse, InsertResponse, JoinResponse, RoomId};

#[derive(Debug)]
pub enum Command {
  Connect {
    res_tx: oneshot::Sender<ConnId>,
  },

  Disconnect {
    conn: ConnId,
  },

  List {
    res_tx: oneshot::Sender<Vec<RoomId>>,
  },

  // for current;
  Content {
    room_id: RoomId,
    res_tx: oneshot::Sender<String>,
  },

  Create {
    conn: ConnId,
    room_id: RoomId,
    content: String,
    agent_name: String,
    conn_tx: mpsc::UnboundedSender<FkResponse>,
    res_tx: oneshot::Sender<CreateResponse>,
  },

  Join {
    conn: ConnId,
    room_id: RoomId,
    agent_name: String,
    res_tx: oneshot::Sender<JoinResponse>,
  },

  Insert {
    conn: ConnId,
    content: String,
    pos: usize,
    room_id: RoomId,
    res_tx: oneshot::Sender<InsertResponse>,
  },

  Delete {
    conn: ConnId,
    room_id: RoomId,
    range: Range<usize>,
    res_tx: oneshot::Sender<DeleteResponse>,
  },
}
