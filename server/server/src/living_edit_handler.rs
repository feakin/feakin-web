use std::time::{Duration, Instant};

use actix_ws::Message;
use futures_util::{
  future::{select, Either},
  StreamExt as _,
};
use tokio::{pin, sync::mpsc, time::interval};

use crate::LiveEditServerHandle;
use crate::living_edit_server::ConnId;

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);

/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub async fn live_edit_ws(
  edit_server: LiveEditServerHandle,
  mut session: actix_ws::Session,
  mut msg_stream: actix_ws::MessageStream,
) {
  log::info!("connected");

  let mut name = None;
  let mut last_heartbeat = Instant::now();
  let mut interval = interval(HEARTBEAT_INTERVAL);

  let (conn_tx, mut conn_rx) = mpsc::unbounded_channel();


  // unwrap: chat server is not dropped before the HTTP server
  let conn_id = edit_server.connect(conn_tx).await;


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
            process_text_msg(&edit_server, &mut session, &text, conn_id, &mut name)
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
  session: &mut actix_ws::Session,
  text: &str,
  conn: ConnId,
  name: &mut Option<String>,
) {
  // strip leading and trailing whitespace (spaces, newlines, etc.)
  let msg = text.trim();

  // we check for /<cmd> type of messages
  if msg.starts_with('/') {
    let mut cmd_args = msg.splitn(2, ' ');

    // unwrap: we have guaranteed non-zero string length already
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

      "/name" => match cmd_args.next() {
        Some(new_name) => {
          log::info!("conn {conn}: setting name to: {new_name}");
          name.replace(new_name.to_owned());
        }
        None => {
          session.text("!!! name is required").await.unwrap();
        }
      },

      "/create" => match cmd_args.next() {
        Some(content) => {
          log::info!("conn {conn}: create {content}");
          // generate room name
          edit_server.create(conn, "phodal", content).await;
          session.text(format!("create success!")).await.unwrap();
        }
        None => {
          session.text("!!! room name is required").await.unwrap();
        }
      },

      "/insert" => match cmd_args.next() {
        Some(content) => {
          log::info!("conn {conn}: insert {content}");
          edit_server.insert(conn, content).await;
          session.text(format!("insert {content}")).await.unwrap();
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
    // prefix message with our name, if assigned
    let msg = match name {
      Some(ref name) => format!("{name}: {msg}"),
      None => msg.to_owned(),
    };

    edit_server.send_message(conn, msg).await
  }
}
