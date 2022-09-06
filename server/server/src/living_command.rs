use std::ops::Range;
use tokio::sync::{mpsc, oneshot};
use crate::living_action_dto::{ConnId, RoomId};

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
    conn_tx: mpsc::UnboundedSender<Msg>,
    res_tx: oneshot::Sender<()>,
  },

  Join {
    conn: ConnId,
    room_id: RoomId,
    res_tx: oneshot::Sender<Option<String>>,
  },

  Insert {
    conn: ConnId,
    content: String,
    pos: usize,
    room_id: RoomId,
    res_tx: oneshot::Sender<Option<String>>,
  },

  Delete {
    conn: ConnId,
    room_id: RoomId,
    range: Range<usize>,
    res_tx: oneshot::Sender<Option<String>>,
  },
}

pub type Msg = String;
