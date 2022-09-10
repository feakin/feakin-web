use std::collections::{HashMap, HashSet};
use std::io;
use std::ops::Range;
use std::sync::{Arc, Mutex};

use actix::Actor;
use actix_web_actors::ws;
use diamond_types::{LocalVersion};
use log::{error, info};
use tokio::sync::{mpsc, oneshot};
use tokio::sync::mpsc::UnboundedSender;

use crate::living::live_coding::LiveCoding;
use crate::model::{Command, ConnId, FkResponse, id_generator, RoomId};

#[derive(Debug)]
pub struct LivingEditServer {
  sessions: HashMap<ConnId, UnboundedSender<FkResponse>>,

  rooms: HashMap<RoomId, HashSet<ConnId>>,

  codings: HashMap<RoomId, Arc<Mutex<LiveCoding>>>,

  versions: HashMap<RoomId, LocalVersion>,

  agents: HashMap<ConnId, String>,

  cmd_rx: mpsc::UnboundedReceiver<Command>,
}

#[derive(Debug, Clone)]
pub struct LiveEditServerHandle {
  cmd_tx: UnboundedSender<Command>,
}

impl LiveEditServerHandle {
  pub async fn connect(&self) -> ConnId {
    let (res_tx, res_rx) = oneshot::channel();

    // unwrap: chat server should not have been dropped
    self.cmd_tx
      .send(Command::Connect { res_tx })
      .unwrap();

    // unwrap: chat server does not drop out response channel
    res_rx.await.unwrap()
  }

  pub fn disconnect(&self, conn: ConnId) {
    self.cmd_tx.send(Command::Disconnect { conn }).unwrap();
  }

  pub(crate) async fn create(&self, conn: ConnId, room_name: impl Into<String>, agent_name: impl Into<String>, content: impl Into<String>, conn_tx: &UnboundedSender<FkResponse>) -> FkResponse {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::Create {
        conn,
        room_id: room_name.into(),
        content: content.into(),
        agent_name: agent_name.into(),
        conn_tx: conn_tx.clone(),
        res_tx,
      })
      .unwrap();

    res_rx.await.unwrap()
  }

  pub(crate) async fn insert(&self, conn: ConnId, content: impl Into<String>, pos: usize, room_id: RoomId) -> FkResponse {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::Insert {
        conn,
        content: content.into(),
        pos,
        room_id: room_id.to_string(),
        res_tx,
      })
      .unwrap();

    res_rx.await.unwrap()
  }

  pub(crate) async fn join(&self, conn: ConnId, room_id: impl Into<String>, agent_name: impl Into<String>) -> FkResponse {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::Join {
        conn,
        room_id: room_id.into(),
        agent_name: agent_name.into(),
        res_tx,
      })
      .unwrap();

    res_rx.await.unwrap()
  }

  pub(crate) async fn delete(&self, conn: ConnId, room_id: RoomId, range: Range<usize>) -> FkResponse {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::Delete {
        conn,
        room_id: room_id.to_string(),
        range,
        res_tx,
      })
      .unwrap();

    res_rx.await.unwrap()
  }

  pub(crate) async fn leave(&self, conn: ConnId, room_id: RoomId) -> FkResponse {
    let (res_tx, res_rx) = oneshot::channel();

    self.cmd_tx
      .send(Command::LeaveRoom {
        conn,
        room_id: room_id.to_string(),
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

  pub async fn list_agent(&self) -> Vec<String> {
    let (res_tx, res_rx) = oneshot::channel();
    self.cmd_tx.send(Command::ListAgents { res_tx }).unwrap();
    res_rx.await.unwrap()
  }

  pub async fn content(&self, room_id: RoomId) -> String {
    let (res_tx, res_rx) = oneshot::channel();
    self.cmd_tx.send(Command::Content { room_id, res_tx }).unwrap();
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
        versions: Default::default(),
        codings,
        agents: Default::default(),
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
        Command::Create { conn, room_id, content, agent_name, conn_tx, res_tx } => {
          let created = self.create(conn, room_id, content, conn_tx, agent_name).await;
          let _ = res_tx.send(FkResponse::create(created.0, created.1));
        }
        Command::Join { conn, room_id, agent_name, res_tx } => {
          let output = self.join(conn, room_id, agent_name).await;
          let _ = res_tx.send(output);
        }
        Command::Insert { conn, content, pos, room_id, res_tx } => {
          let before_version: Option<LocalVersion> = self.codings.get(&room_id).map(|coding| {
            let coding = coding.lock().unwrap();
            coding.local_version()
          });

          let after_version = self.insert(conn, room_id.clone(), content, pos).await;

          if let Some(after_version) = &after_version {
            self.versions.insert(room_id.clone(), after_version.clone());
          }

          self.broadcast_patch(room_id, conn, before_version, after_version.clone()).await;

          let _ = res_tx.send(FkResponse::insert(after_version));
        }
        Command::Delete { conn, room_id, range, res_tx } => {
          let before_version: Option<LocalVersion> = self.codings.get(&room_id).map(|coding| {
            let coding = coding.lock().unwrap();
            coding.local_version()
          });

          let after_version = self.delete(conn, room_id.clone(), range).await;

          if let Some(after_version) = &after_version {
            self.versions.insert(room_id.clone(), after_version.clone());
          }

          self.broadcast_patch(room_id, conn, before_version, after_version.clone()).await;
          let _ = res_tx.send(FkResponse::delete(after_version));
        }
        Command::List { res_tx } => {
          let _ = res_tx.send(self.list_rooms());
        }
        Command::ListAgents { res_tx } => {
          let _ = res_tx.send(self.list_agents());
        }
        Command::Content { room_id, res_tx } => {
          let content = self.content(room_id).await;
          let _ = res_tx.send(content.unwrap_or("".to_string()));
        }
        Command::LeaveRoom { room_id, conn, res_tx } => {
          info!("leave room: {:?}", room_id);
          self.leave_room(room_id, conn).await;
          let _ = res_tx.send(FkResponse::leave());
        }
      }
    }

    Ok(())
  }

  async fn broadcast_patch(&self, room: RoomId, skip: ConnId, before_version: Option<LocalVersion>, after_version: Option<LocalVersion>) {
    if before_version.is_none() || after_version.is_none() {
      return;
    }

    let before = before_version.unwrap();
    let after = after_version.unwrap();

    info!("before version: {:?}, after version: {:?}", before, after);

    if let Some(sessions) = self.rooms.get(&room) {
      let patch: Vec<u8>;

      if let Some(coding) = self.codings.get(&room) {
        let coding = coding.lock().unwrap();
        patch = coding.patch_since(&before);
      } else {
        return;
      }

      for conn_id in sessions {
        if let Some(tx) = self.sessions.get(conn_id) {
          let _ = tx.send(FkResponse::upstream(before.clone(), after.clone(), patch.clone()));
        }
      }
    }
  }

  async fn send_system_message(&self, room: &str, skip: ConnId, msg: impl Into<String>) {
    if let Some(sessions) = self.rooms.get(room) {
      let msg = msg.into();

      for conn_id in sessions {
        if *conn_id != skip {
          if let Some(tx) = self.sessions.get(conn_id) {
            let _ = tx.send(FkResponse::system_message(msg.clone()));
          }
        }
      }
    }
  }

  fn list_rooms(&mut self) -> Vec<String> {
    self.rooms.keys().cloned().collect()
  }

  fn list_agents(&mut self) -> Vec<String> {
    self.agents.values().cloned().collect()
  }

  async fn connect(&mut self) -> ConnId {
    id_generator()
  }

  async fn create(&mut self, conn: ConnId, room_id: RoomId, content: String, conn_tx: UnboundedSender<FkResponse>, _agent_name: String) -> (String, Vec<u8>) {
    self.sessions.insert(conn, conn_tx);
    self.rooms
      .entry(room_id.clone())
      .or_insert_with(HashSet::new)
      .insert(conn);


    let agent = conn.to_string();

    let mut coding = LiveCoding::new(&agent);
    self.agents.insert(conn, agent.clone());

    coding.create(&agent, &content);

    let bytes = coding.bytes();

    self.versions.insert(room_id.clone(), coding.inner.local_version());
    self.codings.insert(room_id.clone(), Arc::new(Mutex::new(coding)));

    (room_id.clone(), bytes)
  }

  async fn insert(&mut self, conn: ConnId, room_id: RoomId, content: String, pos: usize) -> Option<LocalVersion> {
    match self.codings.get(&*room_id) {
      Some(coding) => {
        let mut mutex_coding = coding.lock().unwrap();
        let agent = conn.to_string();

        mutex_coding.insert(&*agent, pos, &content);

        Some(mutex_coding.local_version())
      }
      None => {
        error!("room {:?} not found", room_id);
        None
      }
    }
  }

  async fn delete(&mut self, conn: ConnId, room_id: RoomId, range: Range<usize>) -> Option<LocalVersion> {
    match self.codings.get(&*room_id) {
      Some(coding) => {
        let mut mutex_coding = coding.lock().unwrap();
        let agent = conn.to_string();

        mutex_coding.delete(&*agent, range);
        Some(mutex_coding.local_version())
      }
      None => {
        error!("room {:?} not found", room_id);
        None
      }
    }
  }

  async fn content(&self, room_id: RoomId) -> Option<String> {
    match self.codings.get(&*room_id) {
      Some(coding) => {
        let mutex_coding = coding.lock().unwrap();
        let content = mutex_coding.content().clone();
        Some(content)
      }
      None => {
        error!("content {:?} not found", room_id);
        None
      }
    }
  }

  async fn join(&mut self, conn: ConnId, room_id: RoomId, _agent_name: String) -> FkResponse {
    self.rooms
      .entry(room_id.clone())
      .or_insert_with(HashSet::new)
      .insert(conn);

    let agent_name = conn.to_string();
    self.agents.insert(conn, agent_name.clone());

    return match self.codings.get_mut(&*room_id.clone()) {
      Some(coding) => {
        let mut mutex_coding = coding.lock().unwrap();

        let data = mutex_coding.bytes();

        let agent_id = mutex_coding.join(&*agent_name);

        FkResponse::join(room_id.clone(), data, agent_id.to_string(), None, agent_name)
      }
      None => {
        let error_msg = format!("room {:?} not found", room_id);
        FkResponse::join("".to_string(), vec![], "".to_string(), Some(error_msg), agent_name)
      }
    };
  }

  async fn disconnect(&mut self, conn_id: ConnId) {
    let mut rooms: Vec<String> = Vec::new();

    if self.sessions.remove(&conn_id).is_some() {
      for (name, sessions) in &mut self.rooms {
        if sessions.remove(&conn_id) {
          rooms.push(name.to_owned());
        }
      }
    }

    self.agents.remove(&conn_id);

    // send message to other users
    for room in rooms {
      self.send_system_message(&room, 0, "Someone disconnected")
        .await;
    }
  }

  async fn leave_room(&mut self, _room_id: RoomId, _conn_id: ConnId) {}
}
