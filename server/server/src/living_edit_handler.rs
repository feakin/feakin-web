use std::time::{Duration, Instant};

use actix_ws::{Message, Session};
use futures_util::{
  future::{Either, select},
  StreamExt as _,
};
use tokio::{pin, sync::mpsc, time::interval};
use tokio::sync::mpsc::UnboundedSender;

use crate::LiveEditServerHandle;
use crate::living::random_name;
use crate::model::{ActionType, ConnId, FkResponse};

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);

/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub async fn live_edit_ws(
  edit_server: LiveEditServerHandle,
  mut session: Session,
  mut msg_stream: actix_ws::MessageStream,
) {
  log::info!("connected");

  let mut last_heartbeat = Instant::now();
  let mut interval = interval(HEARTBEAT_INTERVAL);

  let (conn_tx, mut conn_rx) = mpsc::unbounded_channel();

  let conn_id = edit_server.connect().await;

  let close_reason = loop {
    let tick = interval.tick();
    pin!(tick);

    let msg_rx = conn_rx.recv();
    pin!(msg_rx);

    let messages = select(msg_stream.next(), msg_rx);
    pin!(messages);

    match select(messages, tick).await {
      // commands & messages received from client
      Either::Left((Either::Left((Some(Ok(msg)), _)), _)) => {
        log::debug!("msg: {msg:?}");

        match msg {
          Message::Ping(bytes) => {
            last_heartbeat = Instant::now();
            // unwrap:
            session.pong(&bytes).await.unwrap();
          }

          Message::Pong(_) => {
            last_heartbeat = Instant::now();
          }

          Message::Text(text) => {
            process(&edit_server, &mut session, &text, conn_id, &conn_tx).await;
          }

          // todo: change to binary
          Message::Binary(_bin) => {
            log::warn!("unexpected binary message");
          }

          Message::Close(reason) => break reason,

          _ => {
            break None;
          }
        }
      }

      // client WebSocket stream error
      Either::Left((Either::Left((Some(Err(err)), _)), _)) => {
        log::error!("{:?}", err);
        break None;
      }

      Either::Left((Either::Left((None, _)), _)) => break None,

      Either::Left((Either::Right((Some(chat_msg), _)), _)) => {
        session.text(serde_json::to_string(&chat_msg).unwrap()).await.unwrap();
      }

      Either::Left((Either::Right((None, _)), _)) => unreachable!(
        "all connection message senders were dropped; chat server may have panicked"
      ),

      // heartbeat internal tick
      Either::Right((_inst, _)) => {
        // if no heartbeat ping/pong received recently, close the connection
        if Instant::now().duration_since(last_heartbeat) > CLIENT_TIMEOUT {
          log::info!(
                        "client has not sent heartbeat in over {CLIENT_TIMEOUT:?}; disconnecting"
                    );
          break None;
        }

        // send heartbeat ping
        let _ = session.ping(b"").await;
      }
    };
  };

  edit_server.disconnect(conn_id);

  let _ = session.close(close_reason).await;
}

async fn process(
  edit_server: &LiveEditServerHandle,
  session: &mut Session,
  text: &str,
  conn: ConnId,
  conn_tx: &UnboundedSender<FkResponse>,
) {
  if text.starts_with('/') {
    log::info!("execute debug command: {}", text);
    execute_debug_command(edit_server, session, text, conn).await;
    return;
  }

  let action: ActionType = match serde_json::from_str(text) {
    Ok(action) => action,
    Err(err) => {
      log::error!("invalid message: {}", err);
      session.text(format!("invalid message: {}", err)).await.unwrap();
      return;
    }
  };

  match action {
    ActionType::CreateRoom(room) => {
      let room_name = random_name();
      let agent_name = room.agent_name.unwrap_or(random_name());
      let input = room.input.unwrap_or_default();
      let output = edit_server.create(conn, room_name.clone(), agent_name, &input, conn_tx).await;
      session.text(serde_json::to_string(&output).unwrap()).await.unwrap();
    }
    ActionType::JoinRoom(room) => {
      let agent_name = room.agent_name.unwrap_or(random_name());
      let output = edit_server.join(conn, &room.room_id, agent_name).await;
      session.text(serde_json::to_string(&output).unwrap()).await.unwrap();
    }
    ActionType::Delete(delete) => {
      let output = edit_server.delete(conn, delete.room_id, delete.range).await;
      session.text(serde_json::to_string(&output).unwrap()).await.unwrap();
    }

    ActionType::Insert(insert) => {
      let output = edit_server.insert(conn, insert.content, insert.pos, insert.room_id).await;
      session.text(serde_json::to_string(&output).unwrap()).await.unwrap();
    }
  }
}

async fn execute_debug_command(edit_server: &LiveEditServerHandle, session: &mut Session, text: &str, conn: ConnId) {
  let msg = text.trim();
  let mut cmd_args = msg.splitn(2, ' ');

  match cmd_args.next().unwrap() {
    "/list" => {
      log::info!("conn {conn}: listing rooms");
      let rooms = edit_server.list_rooms().await;
      for room in rooms {
        session.text(room).await.unwrap();
      }
    }
    "/content" => match cmd_args.next() {
      Some(room_id) => {
        let output = edit_server.content(room_id.to_string()).await;
        session.text(output).await.unwrap();
      }
      None => {
        session.text("!!! name is required").await.unwrap();
      }
    }
    &_ => {
      session.text("!!! room name is required").await.unwrap();
    }
  }
}
