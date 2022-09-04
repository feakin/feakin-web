use std::collections::{HashMap, HashSet};
use std::io;
use actix::{Actor, StreamHandler};
use actix_web::{App, Error, HttpRequest, HttpResponse, HttpServer, web};
use actix_web_actors::ws;
use tokio::sync::{mpsc, oneshot};

/// Connection ID.
pub type ConnId = usize;

/// Room ID.
pub type RoomId = String;

#[derive(Debug)]
pub struct LivingEditServer {
  rooms: HashMap<RoomId, HashSet<ConnId>>,
  /// Command receiver.
  cmd_rx: mpsc::UnboundedReceiver<Command>,
}

pub type Msg = String;

#[derive(Debug)]
enum Command {
  Connect {
    conn_tx: mpsc::UnboundedSender<Msg>,
    res_tx: oneshot::Sender<ConnId>,
  },
}

#[derive(Debug, Clone)]
pub struct EditServerHandle {
  cmd_tx: mpsc::UnboundedSender<Command>,
}


impl Actor for LivingEditServer {
  type Context = ws::WebsocketContext<Self>;
}

impl LivingEditServer {
  pub fn new() -> (Self, EditServerHandle) {
    let mut rooms = HashMap::with_capacity(4);

    // create default room
    rooms.insert("main".to_owned(), HashSet::new());
    let (cmd_tx, cmd_rx) = mpsc::unbounded_channel();

    (
      Self {
        rooms,
        cmd_rx,
      },
      EditServerHandle { cmd_tx },
    )
  }

  pub async fn run(mut self) -> io::Result<()> {
    while let Some(cmd) = self.cmd_rx.recv().await {
      match cmd { Command::Connect { .. } => {

      } }
    }

    Ok(())
  }
}

/// Handler for ws::Message message
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for LivingEditServer {
  fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
    match msg {
      Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
      Ok(ws::Message::Text(text)) => ctx.text(text),
      Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
      _ => (),
    }
  }
}
