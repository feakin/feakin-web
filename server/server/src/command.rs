use tokio::sync::{mpsc, oneshot};
use crate::living_action::{ConnId, RoomId};

#[derive(Debug)]
pub enum Command {
  Connect {
    res_tx: oneshot::Sender<ConnId>,
  },

  Disconnect {
    conn: ConnId,
  },

  Create {
    conn: ConnId,
    room_id: RoomId,
    content: String,
    conn_tx: mpsc::UnboundedSender<Msg>,
    res_tx: oneshot::Sender<()>,
  },

  List {
    res_tx: oneshot::Sender<Vec<RoomId>>,
  },

  Insert {
    conn: ConnId,
    content: String,
    res_tx: oneshot::Sender<String>,
  },
  // Delete {
  //   conn: ConnId,
  //   agent_id: AgentId,
  //   range: Range,
  // },
  Message {
    msg: Msg,
    conn: ConnId,
    res_tx: oneshot::Sender<()>,
  },
}

pub type Msg = String;
