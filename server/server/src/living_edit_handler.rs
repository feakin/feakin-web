use std::time::{Duration, Instant};

use actix_ws::{Message, Session};
use futures_util::{
  future::{select, Either},
  StreamExt as _,
};
use tokio::{pin, sync::mpsc, time::interval};
use tokio::sync::mpsc::UnboundedSender;

use crate::LiveEditServerHandle;
use crate::living::random_name;
use crate::living_action::{ActionType, ConnId};
use crate::command::Msg;

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

  let mut name = None;
  let mut last_heartbeat = Instant::now();
  let mut interval = interval(HEARTBEAT_INTERVAL);

  let (conn_tx, mut conn_rx) = mpsc::unbounded_channel();

  // unwrap: chat server is not dropped before the HTTP server
  let conn_id = edit_server.connect().await;

  let close_reason = loop {
    // most of the futures we process need to be stack-pinned to work with select()
    let tick = interval.tick();
    pin!(tick);

    let msg_rx = conn_rx.recv();
    pin!(msg_rx);

    // TODO: nested select is pretty gross for readability on the match
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
            process_text_msg(&edit_server, &mut session, &text, conn_id, &mut name, &conn_tx)
              .await;
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
        log::error!("{}", err);
        break None;
      }

      // client WebSocket stream ended
      Either::Left((Either::Left((None, _)), _)) => break None,

      // chat messages received from other room participants
      Either::Left((Either::Right((Some(chat_msg), _)), _)) => {
        session.text(chat_msg).await.unwrap();
      }

      // all connection's message senders were dropped
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

  // attempt to close connection gracefully
  let _ = session.close(close_reason).await;
}

async fn process_text_msg(
  edit_server: &LiveEditServerHandle,
  session: &mut Session,
  text: &str,
  conn: ConnId,
  name: &mut Option<String>,
  conn_tx: &UnboundedSender<Msg>,
) {
  let action: ActionType = match serde_json::from_str(text) {
    Ok(action) => action,
    Err(err) => {
      pure_text(edit_server, session, text, conn, name, conn_tx).await;
      log::error!("invalid message: {}", err);
      edit_server.send_message(conn, format!("invalid message: {}", err)).await;
      return;
    }
  };

  match action {
    ActionType::CreateRoom(room) => {
      let room_name = random_name();

      let input = room.input.unwrap_or_default();
      edit_server.create(conn, room_name.clone(), &input, conn_tx).await;

      //todo: make output to object
      session.text(format!("create room {room_name} success!")).await.unwrap();
    }
    ActionType::JoinRoom(room) => {
      edit_server.join(conn, room.room_id).await;
    }
    ActionType::Delete(_) => {}
    ActionType::Insert(insert) => {
      let output = edit_server.insert(conn, insert.content, insert.pos).await;
      session.text(format!("current: {output}")).await.unwrap();
    }
  }
}

async fn pure_text(edit_server: &LiveEditServerHandle, session: &mut Session, text: &str, conn: ConnId, name: &mut Option<String>, conn_tx: &UnboundedSender<Msg>) {
  let msg = text.trim();

  if msg.starts_with('/') {
    let mut cmd_args = msg.splitn(2, ' ');

    match cmd_args.next().unwrap() {
      "/list" => {
        log::info!("conn {conn}: listing rooms");
        let rooms = edit_server.list_rooms().await;
        for room in rooms {
          session.text(room).await.unwrap();
        }
      }

      "/join" => match cmd_args.next() {
        Some(room) => {
          log::info!("conn {conn}: joining room {room}");
          // edit_server.join_room(conn, room).await;
          session.text(format!("joined {room}")).await.unwrap();
        }

        None => {
          session.text("!!! room name is required").await.unwrap();
        }
      },

      _ => {
        session
          .text(format!("!!! unknown command: {msg}"))
          .await
          .unwrap();
      }
    }
  } else {
    let msg = match name {
      Some(ref name) => format!("{name}: {msg}"),
      None => msg.to_owned(),
    };

    edit_server.send_message(conn, msg).await
  }
}