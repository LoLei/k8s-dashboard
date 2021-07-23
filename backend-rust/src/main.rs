#[macro_use]
extern crate rocket;
use k8s_dashboard_backend::types::{NamespacedPods, Node};
use rocket::http::Status;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Message {
    message: String,
}

#[get("/api/k8s/pods")]
async fn pods() -> Result<Json<NamespacedPods>, Status> {
    let res = k8s_dashboard_backend::pods()
        .await
        // If a Status context is attached to the anyhow error this Status would be returned from the route,
        // otherwise the 500 Status is returned
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    Ok(Json(res))
}

#[get("/api/k8s/nodes")]
async fn nodes() -> Result<Json<Vec<Node>>, Status> {
    let res = k8s_dashboard_backend::nodes()
        .await
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    Ok(Json(res))
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![pods, nodes])
}
