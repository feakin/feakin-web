use actix_files::NamedFile;
use actix_web::{App, get, Error, HttpRequest, HttpResponse, HttpServer, Responder, web};
use tokio::{
  task::{spawn, spawn_local},
  try_join,
};

pub use living_edit_server::LivingEditServer;

use crate::living_edit_server::LiveEditServerHandle;

mod living;
mod living_edit_server;
mod living_edit_handler;
mod living_action;

// keep some api for testing
#[get("/api/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
  format!("Hello {name}!")
}

async fn index() -> impl Responder {
  NamedFile::open_async("./static/index.html").await.unwrap()
}

/// Handshake and start WebSocket handler with heartbeats.
async fn living_edit(
  req: HttpRequest,
  stream: web::Payload,
  edit_server: web::Data<LiveEditServerHandle>,
) -> Result<HttpResponse, Error> {
  let (res, session, msg_stream) = actix_ws::handle(&req, stream)?;

  // spawn websocket handler (and don't await it) so that the response is returned immediately
  spawn_local(living_edit_handler::live_edit_ws((**edit_server).clone(), session, msg_stream));

  Ok(res)
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> std::io::Result<()> {
  env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
  let port = 8804;

  log::info!("starting HTTP server at http://localhost:{port}");

  let (edit_server, server_tx) = LivingEditServer::new();
  let server_handle = spawn(edit_server.run());

  let http_server = HttpServer::new(move || {
    App::new()
      .app_data(web::Data::new(server_tx.clone()))
      .service(web::resource("/").to(index))
      .service(greet)
      .service(web::resource("/living/edit").route(web::get().to(living_edit)))
  })
    .workers(2)
    .bind(("127.0.0.1", port))?
    .run();


  try_join!(http_server, async move { server_handle.await.unwrap() })?;

  Ok(())
}
