#[macro_use]
extern crate rocket;
use std::convert::TryFrom;

use k8s_dashboard_backend::types::{ApiResponseNodes, ApiResponsePods, KubeClient, RocketConfig};
use kube::config::KubeConfigOptions;
use kube::{Client, Config};
use rocket::http::Status;
use rocket::serde::json::Json;
use rocket::State;

#[get("/api/health")]
async fn health() -> Status {
    Status::Ok
}

#[get("/api/k8s/pods")]
async fn pods(kube_client: &State<KubeClient>) -> Result<Json<ApiResponsePods>, Status> {
    let items = k8s_dashboard_backend::pods(&kube_client.client)
        .await
        // If a Status context is attached to the anyhow error this Status would be returned from the route,
        // otherwise the 500 Status is returned
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    Ok(Json(ApiResponsePods { items }))
}

#[get("/api/k8s/nodes")]
async fn nodes(kube_client: &State<KubeClient>) -> Result<Json<ApiResponseNodes>, Status> {
    let nodes = k8s_dashboard_backend::nodes(&kube_client.client)
        .await
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    Ok(Json(ApiResponseNodes { nodes }))
}

#[launch]
async fn rocket() -> _ {
    let rocket = rocket::build();
    let figment = rocket.figment();

    let rocket_config: RocketConfig = figment.extract().expect("Could not extract Rocket config");

    let client = if rocket_config.cluster_deployment {
        Client::try_default()
            .await
            .expect("Could not create kube client via cluster method")
    } else {
        let kube_config = Config::from_kubeconfig(&KubeConfigOptions {
            cluster: None,
            context: None,
            // This user had to be created specifically https://github.com/kube-rs/kube-rs/issues/196
            user: Some(String::from("rust")),
        })
        .await
        .expect("Could not create kube kube_config");

        Client::try_from(kube_config).expect("Could not create kube client via config method")
    };

    rocket
        .mount("/", routes![pods, nodes, health])
        .manage(KubeClient { client })
}
