use crate::EditServerHandle;

pub async fn edit_ws(
  edit_server: EditServerHandle,
  mut session: actix_ws::Session,
  mut msg_stream: actix_ws::MessageStream,
) {
  log::info!("connected");
}
