use std::ops::Range;

use tokio::sync::{mpsc, oneshot};

use crate::model::{ConnId, FkResponse, RoomId};

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

  ListAgents {
    res_tx: oneshot::Sender<Vec<String>>,
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
    res_tx: oneshot::Sender<FkResponse>,
  },

  Join {
    conn: ConnId,
    room_id: RoomId,
    agent_name: String,
    res_tx: oneshot::Sender<FkResponse>,
  },

  Insert {
    conn: ConnId,
    content: String,
    pos: usize,
    room_id: RoomId,
    res_tx: oneshot::Sender<FkResponse>,
  },

  Delete {
    conn: ConnId,
    room_id: RoomId,
    range: Range<usize>,
    res_tx: oneshot::Sender<FkResponse>,
  },

  LeaveRoom {
    conn: ConnId,
    room_id: RoomId,
    res_tx: oneshot::Sender<FkResponse>,
  },
}
