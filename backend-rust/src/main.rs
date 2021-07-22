#[macro_use]
extern crate rocket;
use rocket::http::Status;
use rocket::serde::{Deserialize, Serialize};
use rocket::serde::json::Json;

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Message {
    message: String,
}

#[get("/")]
async fn index() -> Result<Json<Message>, Status> {
    let res = k8s_dashboard_backend::pods()
        .await
        // If a Status context is attached to the anyhow error this Status would be returned from the route,
        // otherwise the 500 Status is returned
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    dbg!(res);

    Ok(Json(Message { message: String::from("hello") }))
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}
