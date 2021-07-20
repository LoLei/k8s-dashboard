#[macro_use]
extern crate rocket;
use k8s_dashboard_backend::types::Message;
use rocket::http::Status;
use rocket::serde::json::Json;

#[get("/")]
async fn index() -> Result<Json<Message>, Status> {
    let res = k8s_dashboard_backend::pods()
        .await
        .map_err(|_| Status::InternalServerError)?;

    Ok(res)
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}
