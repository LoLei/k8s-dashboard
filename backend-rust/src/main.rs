#[macro_use]
extern crate rocket;
use k8s_dashboard_backend::types::Message;
use rocket::http::Status;
use rocket::serde::json::Json;

#[get("/")]
async fn index() -> Result<Json<Message>, Status> {
    let res = k8s_dashboard_backend::pods()
        .await
        // If a Status context is attached to the anyhow error this Status would be returned from the route,
        // otherwise the 500 Status is returned
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    Ok(res)
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}
