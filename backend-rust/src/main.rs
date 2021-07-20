#[macro_use]
extern crate rocket;
use rocket::http::Status;

use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

type Id = usize;

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Message {
    id: Option<Id>,
}

#[get("/")]
async fn index() -> Result<Json<Message>, Status> {
    k8s_dashboard_backend::pods()
        .await
        .map_err(|_| Status::InternalServerError)?;

    Ok(Json(Message { id: Some(4) }))
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}
