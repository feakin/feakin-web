use std::borrow::BorrowMut;
use std::collections::{HashMap, HashSet};
use std::io;
use std::ops::Range;
use std::sync::{Arc, Mutex};
use std::sync::atomic::{AtomicUsize, Ordering};

use actix::{Actor, StreamHandler};
use actix_web::{App, Error, HttpRequest, HttpResponse, HttpServer, web};
use actix_web_actors::ws;
use diamond_types::AgentId;
use diamond_types::list::OpLog;
use log::log;
use rand::{Rng, thread_rng};
use tokio::sync::{mpsc, oneshot};
use crate::living::random_agent_name;

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

  oplogs: HashMap<RoomId, Arc<Mutex<OpLog>>>,

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

  Create {
    conn: ConnId,
    room_name: String,
    content: String,
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

  pub(crate) async fn create(&self, conn: ConnId, room_name: impl Into<String>, content: impl Into<String>) {
    let (res_tx, res_rx) = oneshot::channel();

    // unwrap: chat server should not have been dropped
    self.cmd_tx
      .send(Command::Create {
        conn,
        room_name: room_name.into(),
        content: content.into(),
        res_tx,
      })
      .unwrap();

    // unwrap: chat server does not drop our response channel
    res_rx.await.unwrap();
  }

  pub(crate) async fn insert(&self, conn: ConnId, content: impl Into<String>) -> String {
    let (res_tx, res_rx) = oneshot::channel();

    // unwrap: chat server should not have been dropped
    self.cmd_tx
      .send(Command::Insert {
        conn,
        content: content.into(),
        res_tx,
      })
      .unwrap();

    // unwrap: chat server does not drop our response channel
    res_rx.await.unwrap()
  }


  pub async fn list_rooms(&self) -> Vec<String> {
    let (res_tx, res_rx) = oneshot::channel();

    // unwrap: chat server should not have been dropped
    self.cmd_tx.send(Command::List { res_tx }).unwrap();

    // unwrap: chat server does not drop our response channel
    res_rx.await.unwrap()
  }
}

impl Actor for LivingEditServer {
  type Context = ws::WebsocketContext<Self>;
}

impl LivingEditServer {
  pub fn new() -> (Self, LiveEditServerHandle) {
    let mut rooms = HashMap::with_capacity(4);
    let mut oplogs = HashMap::with_capacity(100);

    // create default room
    rooms.insert("main".to_owned(), HashSet::new());

    let (cmd_tx, cmd_rx) = mpsc::unbounded_channel();

    (
      Self {
        sessions: HashMap::new(),
        visitor_count: Arc::new(AtomicUsize::new(0)),
        rooms,
        oplogs,
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
        Command::List { res_tx } => {
          let _ = res_tx.send(self.list_rooms());
        }

        Command::Message { conn, msg, res_tx } => {
          self.send_message(conn, msg).await;
          let _ = res_tx.send(());
        }
        Command::Insert { conn, content, res_tx } => {
          let opt_version = self.insert(conn, content).await;
          let str: String = opt_version.unwrap_or("".to_string());
          // todo: change to Version
          let _ = res_tx.send(str);
        }
        Command::Create { conn, room_name, content, res_tx } => {
          self.create(conn, room_name, content).await;
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

  /// Returns list of created room names.
  fn list_rooms(&mut self) -> Vec<String> {
    self.rooms.keys().cloned().collect()
  }

  // todo: add run or others ?
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

    let mut oplog = OpLog::new();

    let agent_name = &random_agent_name();
    let agent = oplog.get_or_create_agent_id(agent_name);
    oplog.add_insert(agent, 0, "hello, world!");
    self.oplogs.insert("main".to_owned(), Arc::new(Mutex::new(oplog)));

    let count = self.visitor_count.fetch_add(1, Ordering::SeqCst);
    self.send_system_message("main", 0, format!("Total visitors {count}"))
      .await;

    // send id back
    id
  }

  async fn send_message(&self, conn: ConnId, msg: impl Into<String>) {
    if let Some(room) = self
      .rooms
      .iter()
      .find_map(|(room, participants)| participants.contains(&conn).then_some(room))
    {
      self.send_system_message(room, conn, msg).await;
    };
  }

  async fn create(&mut self, conn: ConnId, room_name: String, content: String) {
    let id = thread_rng().gen::<usize>();

    self.rooms
      .entry(room_name.to_owned())
      .or_insert_with(HashSet::new)
      .insert(id);

    self.send_system_message(&room_name, conn, format!("create room {} with content {}", room_name, content))
      .await;
  }

  async fn insert(&self, conn: ConnId, content: String) -> Option<String> {
    if let Some(room) = self
      .rooms
      .iter()
      .find_map(|(room, participants)| participants.contains(&conn).then_some(room))
    {
      match self.oplogs.get(room) {
        None => {
          println!("room {:?} not found", room);
        }
        Some(mut oplog) => {
          let mut mutex_log = oplog.lock().unwrap();
          mutex_log.add_insert(0, 0, &content);

          let version = mutex_log.local_version();
          let branch = mutex_log.checkout(&version);

          return Some(branch.content().to_string());
        }
      }

      return None;
    };

    return None;
  }

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
