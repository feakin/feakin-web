use actix_web::{App, get, Error, HttpRequest, HttpResponse, HttpServer, Responder, web};
use tokio::{
  task::{spawn, spawn_local},
  try_join,
};

pub use living_edit_server::LivingEditServer;

use crate::living_edit_server::EditServerHandle;

mod living;
mod living_edit_server;
mod handler;

#[get("/api/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
  format!("Hello {name}!")
}

//
// async fn living_edit(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
//   let resp = ws::start(LivingEditServer {}, &req, stream);
//   println!("{:?}", resp);
//   resp
// }

/// Handshake and start WebSocket handler with heartbeats.
async fn living_edit(
  req: HttpRequest,
  stream: web::Payload,
  edit_server: web::Data<EditServerHandle>,
) -> Result<HttpResponse, Error> {
  let (res, session, msg_stream) = actix_ws::handle(&req, stream)?;

  // spawn websocket handler (and don't await it) so that the response is returned immediately
  spawn_local(handler::edit_ws(
    (**edit_server).clone(),
    session,
    msg_stream,
  ));

  Ok(res)
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> std::io::Result<()> {
  env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

  log::info!("starting HTTP server at http://localhost:8804");

  let (edit_server, server_tx) = LivingEditServer::new();

  let server_handle = spawn(edit_server.run());


  let http_server = HttpServer::new(|| {
    App::new()
      .service(greet)
      .route("/living/edit", web::get().to(living_edit))
  })
    .workers(2)
    .bind(("127.0.0.1", 8804))?
    .run();


  try_join!(http_server, async move { server_handle.await.unwrap() })?;

  Ok(())
}
