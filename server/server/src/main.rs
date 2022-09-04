mod living;
mod living_ws;

use actix_web::{get, web, App, HttpServer, Responder, HttpRequest, HttpResponse};
use actix_web::http::Error;
use actix_web_actors::ws;

#[get("/api/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
  format!("Hello {name}!")
}


async fn index(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
  let resp = ws::start(LivingWs {}, &req, stream);
  println!("{:?}", resp);
  resp
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  HttpServer::new(|| {
    App::new()
      .service(greet)
      .route("/living/edit", web::get().to(index))
  })
    .bind(("127.0.0.1", 8804))?
    .run()
    .await
}
