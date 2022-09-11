use rust_embed::RustEmbed;
use actix_files::NamedFile;
use actix_web::{App, Error, get, HttpRequest, HttpResponse, HttpServer, Responder, web};
use actix_web::web::Payload;
use tokio::{
  task::{spawn, spawn_local},
  try_join,
};

pub use living_edit_server::LivingEditServer;

use crate::living_edit_server::LiveEditServerHandle;

mod living;
mod living_edit_server;
mod living_edit_handler;
mod model;

#[derive(RustEmbed)]
#[folder = "static/"]
struct Asset;


fn handle_embedded_file(path: &str) -> HttpResponse {
  match Asset::get(path) {
    Some(content) => HttpResponse::Ok()
      .content_type(mime_guess::from_path(path).first_or_octet_stream().as_ref())
      .body(content.data.into_owned()),
    None => HttpResponse::NotFound().body("404 Not Found"),
  }
}

// keep some api for testing
#[get("/api/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
  format!("Hello {name}!")
}

async fn index() -> impl Responder {
  handle_embedded_file("index.html")
}

async fn living_socket(
  req: HttpRequest,
  payload: Payload,
  edit_server: web::Data<LiveEditServerHandle>,
) -> Result<HttpResponse, Error> {
  let (res, session, msg_stream) = actix_ws::handle(&req, payload)?;

  spawn_local(living_edit_handler::live_edit_ws((**edit_server).clone(), session, msg_stream));

  Ok(res)
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> std::io::Result<()> {
  env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
  let port = std::env::var("PORT").ok()
    .map(|val| val.parse::<u16>())
    .unwrap_or(Ok(8804)).unwrap();

  log::info!("starting HTTP server at http://localhost:{port}");

  let (edit_server, server_tx) = LivingEditServer::new();
  let server_handle = spawn(edit_server.run());

  let http_server = HttpServer::new(move || {
    App::new()
      .app_data(web::Data::new(server_tx.clone()))
      .service(web::resource("/").to(index))
      .service(greet)
      .service(web::resource("/living/edit").route(web::get().to(living_socket)))
  })
    .workers(2)
    .bind(("0.0.0.0", port))?
    .run();

  try_join!(http_server, async move { server_handle.await.unwrap() })?;

  Ok(())
}

#[cfg(test)]
mod tests {
  use actix_web::{http::{self, header::ContentType}, test};

  use super::*;

  #[actix_web::test]
  async fn test_index_ok() {
    let req = test::TestRequest::default()
      .insert_header(ContentType::plaintext())
      .to_http_request();

    let resp = index().await;
    assert_eq!(resp.into_response(&req).status(), http::StatusCode::OK);
  }

  // #[actix_web::test]
  // async fn test_websocket() {
  //   let (req, mut pl) = TestRequest::default()
  //     .insert_header((CONTENT_TYPE, "application/json"))
  //     .insert_header((CONTENT_LENGTH, 16))
  //     .set_payload(Bytes::from_static(b"{\"name\": \"test\"}"))
  //     .app_data(web::Data::new(JsonConfig::default().limit(10)))
  //     .to_http_parts();
  //
  //   let (edit_server, server_tx) = LivingEditServer::new();
  //
  //   let resp = living_socket(req, actix_web::web::Payload(pl), web::Data::new(server_tx)).await;
  //   assert_eq!(resp.unwrap().status(), http::StatusCode::SWITCHING_PROTOCOLS);
  // }
}

