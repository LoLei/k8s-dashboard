#[macro_use]
extern crate rocket;
use std::convert::TryFrom;

use k8s_dashboard_backend::types::{KubeClient, NamespacedPods, Node, RocketConfig};
use kube::config::KubeConfigOptions;
use kube::{Client, Config};
use rocket::http::Status;
use rocket::serde::json::Json;
use rocket::State;

#[get("/api/k8s/pods")]
async fn pods(kube_client: &State<KubeClient>) -> Result<Json<NamespacedPods>, Status> {
    let res = k8s_dashboard_backend::pods(&kube_client.client)
        .await
        // If a Status context is attached to the anyhow error this Status would be returned from the route,
        // otherwise the 500 Status is returned
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    Ok(Json(res))
}

#[get("/api/k8s/nodes")]
async fn nodes(kube_client: &State<KubeClient>) -> Result<Json<Vec<Node>>, Status> {
    let res = k8s_dashboard_backend::nodes(&kube_client.client)
        .await
        .map_err(|e| e.downcast().unwrap_or(Status::InternalServerError))?;

    Ok(Json(res))
}

#[launch]
async fn rocket() -> _ {
    let rocket = rocket::build();
    let figment = rocket.figment();

    let rocket_config: RocketConfig = figment.extract().expect("Could not extract Rocket config");
    dbg!(rocket_config);

    let kube_config = Config::from_kubeconfig(&KubeConfigOptions {
        cluster: None,
        context: None,
        user: Some(String::from("rust")), // This user had to be created specifically https://github.com/kube-rs/kube-rs/issues/196
    })
    .await
    .expect("Could not create kube kube_config");

    let client = Client::try_from(kube_config).expect("Could not create kube client");
    // let client = Client::try_default().await?; // This should work in the cluster

    rocket
        .mount("/", routes![pods, nodes])
        .manage(KubeClient { client })
}
