use std::collections::{HashMap, HashSet};
use std::io;
use std::sync::{Arc, Mutex};

use actix::Actor;
use actix_web_actors::ws;
use tokio::sync::{mpsc, oneshot};
use tokio::sync::mpsc::UnboundedSender;

use crate::command::{Command, Msg};
use crate::living::live_coding::LiveCoding;
use crate::living::random_name;
use crate::living_action::{ConnId, id_generator, RoomId};

#[derive(Debug)]
pub struct LivingEditServer {
  /// Map of connection IDs to their message receivers.
  sessions: HashMap<ConnId, mpsc::UnboundedSender<Msg>>,

  rooms: HashMap<RoomId, HashSet<ConnId>>,

  codings: HashMap<RoomId, Arc<Mutex<LiveCoding>>>,

  /// Command receiver.
  cmd_rx: mpsc::UnboundedReceiver<Command>,
}

#[derive(Debug, Clone)]
pub struct LiveEditServerHandle {
  cmd_tx: mpsc::UnboundedSender<Command>,
}

impl LiveEditServerHandle {
  /// Register client message sender and obtain connection ID.
  pub async fn connect(&self) -> ConnId {
    let (res_tx, res_rx) = oneshot::channel();

    // unwrap: chat server should not have been dropped
    self.cmd_tx
      .send(Command::Connect { res_tx })
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

  pub(crate) async fn create(&self, conn: ConnId, room_name: impl Into<String>, content: impl Into<String>, conn_tx: &UnboundedSender<Msg>) {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::Create {
        conn,
        room_id: room_name.into(),
        content: content.into(),
        conn_tx: conn_tx.clone(),
        res_tx,
      })
      .unwrap();

    res_rx.await.unwrap();
  }

  pub(crate) async fn insert(&self, conn: ConnId, content: impl Into<String>, pos: usize) -> String {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::Insert {
        conn,
        content: content.into(),
        pos,
        res_tx,
      })
      .unwrap();

    res_rx.await.unwrap()
  }

  pub(crate) async fn join(&self, conn: ConnId, room_id: impl Into<String>) {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::Join {
        conn,
        room_id: room_id.into(),
        res_tx,
      })
      .unwrap();

    res_rx.await.unwrap()
  }

  pub async fn list_rooms(&self) -> Vec<String> {
    let (res_tx, res_rx) = oneshot::channel();
    self.cmd_tx.send(Command::List { res_tx }).unwrap();
    res_rx.await.unwrap()
  }
}

impl Actor for LivingEditServer {
  type Context = ws::WebsocketContext<Self>;
}

impl LivingEditServer {
  pub fn new() -> (Self, LiveEditServerHandle) {
    let rooms = HashMap::with_capacity(4);
    let codings = HashMap::with_capacity(100);

    let (cmd_tx, cmd_rx) = mpsc::unbounded_channel();

    (
      Self {
        sessions: HashMap::new(),
        rooms,
        codings,
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
        Command::Connect { res_tx } => {
          let conn_id = self.connect().await;
          let _ = res_tx.send(conn_id);
        }
        Command::Disconnect { conn } => {
          self.disconnect(conn).await;
        }
        Command::Create { conn, room_id, content, conn_tx, res_tx } => {
          self.create(room_id, conn, content, conn_tx).await;
          let _ = res_tx.send(());
        }
        Command::List { res_tx } => {
          let _ = res_tx.send(self.list_rooms());
        }
        Command::Message { conn, msg, res_tx } => {
          self.send_message(conn, msg).await;
          let _ = res_tx.send(());
        }
        Command::Insert { conn, content, pos, res_tx } => {
          let opt_version = self.insert(conn, content, pos).await;
          let str: String = opt_version.unwrap_or("".to_string());
          // todo: change to Version
          let _ = res_tx.send(str);
        }

        Command::Join { conn, room_id, res_tx } => {
          self.join(conn, room_id).await;
          let _ = res_tx.send(());
        }
        Command::Delete { .. } => {}
      }
    }

    Ok(())
  }

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

  fn list_rooms(&mut self) -> Vec<String> {
    self.rooms.keys().cloned().collect()
  }

  async fn connect(&mut self) -> ConnId {
    id_generator()
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

  async fn create(&mut self, room_id: RoomId, conn: ConnId, content: String, conn_tx: mpsc::UnboundedSender<String>) {
    let id = id_generator();
    self.sessions.insert(id, conn_tx);

    self.rooms
      .entry(room_id.clone())
      .or_insert_with(HashSet::new)
      .insert(conn);

    let agent_name = &random_name();
    let mut coding = LiveCoding::new(&agent_name);
    coding.insert(agent_name, 0, &content);

    self.codings.insert(room_id.clone(), Arc::new(Mutex::new(coding)));
  }

  async fn insert(&self, conn: ConnId, content: String, pos: usize) -> Option<String> {
    let room_opt = self
      .rooms
      .iter()
      .find_map(|(room, participants)| participants.contains(&conn).then_some(room));

    if let Some(room) = room_opt {
      match self.codings.get(room) {
        Some(coding) => {
          let mut mutex_coding = coding.lock().unwrap();
          let agent = conn.to_string();
          mutex_coding.insert(&*agent, pos, &content);

          let content = mutex_coding.content().clone();
          return Some(content);
        }
        None => {
          println!("room {:?} not found", room);
        }
      }

      return None;
    };

    return None;
  }

  async fn join(&mut self, conn: ConnId, room_id: RoomId) -> Option<String> {
    self.rooms
      .entry(room_id.clone())
      .or_insert_with(HashSet::new)
      .insert(conn);

    let agent_name = &random_name();
    return match self.codings.get_mut(&*room_id.clone()) {
      Some(coding) => {
        let agent_id = coding.lock().unwrap().join(agent_name);
        Some(agent_id.to_string())
      }
      None => None,
    }
  }

  async fn disconnect(&mut self, conn_id: ConnId) {
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
