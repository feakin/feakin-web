use std::collections::{HashMap, HashSet};
use std::io;
use std::sync::Arc;
use std::sync::atomic::{AtomicUsize, Ordering};
use actix::{Actor, StreamHandler};
use actix_web::{App, Error, HttpRequest, HttpResponse, HttpServer, web};
use actix_web_actors::ws;
use rand::{Rng, thread_rng};
use tokio::sync::{mpsc, oneshot};

/// Connection ID.
pub type ConnId = usize;

/// Room ID.
pub type RoomId = String;

#[derive(Debug)]
pub struct LivingEditServer {
  /// Map of connection IDs to their message receivers.
  sessions: HashMap<ConnId, mpsc::UnboundedSender<Msg>>,

  /// Tracks total number of historical connections established.
  visitor_count: Arc<AtomicUsize>,

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
  Disconnect {
    conn: ConnId,
  },
  Message {
    msg: Msg,
    conn: ConnId,
    res_tx: oneshot::Sender<()>,
  },
}

#[derive(Debug, Clone)]
pub struct LiveEditServerHandle {
  cmd_tx: mpsc::UnboundedSender<Command>,
}

impl LiveEditServerHandle {
  /// Register client message sender and obtain connection ID.
  pub async fn connect(&self, conn_tx: mpsc::UnboundedSender<String>) -> ConnId {
    let (res_tx, res_rx) = oneshot::channel();

    // unwrap: chat server should not have been dropped
    self.cmd_tx
      .send(Command::Connect { conn_tx, res_tx })
      .unwrap();

    // unwrap: chat server does not drop out response channel
    res_rx.await.unwrap()
  }


  /// Unregister message sender and broadcast disconnection message to current room.
  pub fn disconnect(&self, conn: ConnId) {
    // unwrap: chat server should not have been dropped
    self.cmd_tx.send(Command::Disconnect { conn }).unwrap();
  }

  /// Broadcast message to current room.
  pub async fn send_message(&self, conn: ConnId, msg: impl Into<String>) {
    let (res_tx, res_rx) = oneshot::channel();

    // unwrap: chat server should not have been dropped
    self.cmd_tx
      .send(Command::Message {
        msg: msg.into(),
        conn,
        res_tx,
      })
      .unwrap();

    // unwrap: chat server does not drop our response channel
    res_rx.await.unwrap();
  }
}

impl Actor for LivingEditServer {
  type Context = ws::WebsocketContext<Self>;
}

impl LivingEditServer {
  pub fn new() -> (Self, LiveEditServerHandle) {
    let mut rooms = HashMap::with_capacity(4);

    // create default room
    rooms.insert("main".to_owned(), HashSet::new());
    let (cmd_tx, cmd_rx) = mpsc::unbounded_channel();

    (
      Self {
        sessions: HashMap::new(),
        visitor_count: Arc::new(AtomicUsize::new(0)),
        rooms,
        cmd_rx,
      },
      LiveEditServerHandle {
        cmd_tx
      },
    )
  }

  pub async fn run(mut self) -> io::Result<()> {
    while let Some(cmd) = self.cmd_rx.recv().await {
      match cmd {
        Command::Connect { conn_tx, res_tx } => {
          let conn_id = self.connect(conn_tx).await;
          let _ = res_tx.send(conn_id);
        }
        Command::Disconnect { conn } => {
          self.disconnect(conn).await;
        }
        Command::Message { conn, msg, res_tx } => {
          self.send_message(conn, msg).await;
          let _ = res_tx.send(());
        }
      }
    }

    Ok(())
  }

  /// Send message to users in a room.
  ///
  /// `skip` is used to prevent messages triggered by a connection also being received by it.
  async fn send_system_message(&self, room: &str, skip: ConnId, msg: impl Into<String>) {
    if let Some(sessions) = self.rooms.get(room) {
      let msg = msg.into();

      for conn_id in sessions {
        if *conn_id != skip {
          if let Some(tx) = self.sessions.get(conn_id) {
            // errors if client disconnected abruptly and hasn't been timed-out yet
            let _ = tx.send(msg.clone());
          }
        }
      }
    }
  }

  async fn connect(&mut self, tx: mpsc::UnboundedSender<Msg>) -> ConnId {
    log::info!("Someone joined");

    // notify all users in same room
    self.send_system_message("main", 0, "Someone joined").await;

    // register session with random connection ID
    let id = thread_rng().gen::<usize>();
    self.sessions.insert(id, tx);

    // auto join session to main room
    self.rooms
      .entry("main".to_owned())
      .or_insert_with(HashSet::new)
      .insert(id);

    let count = self.visitor_count.fetch_add(1, Ordering::SeqCst);
    self.send_system_message("main", 0, format!("Total visitors {count}"))
      .await;

    // send id back
    id
  }


  /// Unregister connection from room map and broadcast disconnection message.
  async fn disconnect(&mut self, conn_id: ConnId) {
    println!("Someone disconnected");

    let mut rooms: Vec<String> = Vec::new();

    // remove sender
    if self.sessions.remove(&conn_id).is_some() {
      // remove session from all rooms
      for (name, sessions) in &mut self.rooms {
        if sessions.remove(&conn_id) {
          rooms.push(name.to_owned());
        }
      }
    }

    // send message to other users
    for room in rooms {
      self.send_system_message(&room, 0, "Someone disconnected")
        .await;
    }
  }


  /// Send message to all other users in current room.
  ///
  /// `conn` is used to find current room and prevent messages sent by a connection also being
  /// received by it.
  async fn send_message(&self, conn: ConnId, msg: impl Into<String>) {
    if let Some(room) = self
      .rooms
      .iter()
      .find_map(|(room, participants)| participants.contains(&conn).then_some(room))
    {
      self.send_system_message(room, conn, msg).await;
    };
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
