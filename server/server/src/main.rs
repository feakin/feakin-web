use actix_web::{App, get, HttpRequest, HttpResponse, HttpServer, Responder, web};
use actix_web::http::Error;
use actix_web_actors::ws;

pub use living_edit_server::LivingEditServer;

mod living;
mod living_edit_server;

#[get("/api/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
  format!("Hello {name}!")
}


async fn living_edit(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
  let resp = ws::start(LivingEditServer {}, &req, stream);
  println!("{:?}", resp);
  resp
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  HttpServer::new(|| {
    App::new()
      .service(greet)
      .route("/living/edit", web::get().to(living_edit))
  })
    .bind(("127.0.0.1", 8804))?
    .run()
    .await
}
