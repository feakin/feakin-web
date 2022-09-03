mod livegraph;

use actix_web::{get, web, App, HttpServer, Responder};

#[get("/api/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
  format!("Hello {name}!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  HttpServer::new(|| {
    App::new().service(greet)
  })
    .bind(("127.0.0.1", 8804))?
    .run()
    .await
}
