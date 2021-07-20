pub mod types;

use k8s_openapi::api::core::v1::Pod;
use kube::api::ListParams;
use kube::config::KubeConfigOptions;
use kube::{Api, Client};
use kube::{Config, ResourceExt};
use rocket::serde::json::Json;
use std::convert::TryFrom;
use types::Message;

pub async fn pods() -> Result<Json<Message>, anyhow::Error> {
    // TODO: Move this into rocket initialization or somewhere else so it's not done for each request
    // This should not be necessary in the cluster
    let config = Config::from_kubeconfig(&KubeConfigOptions {
        cluster: None,
        context: None,
        user: Some(String::from("rust")), // This user had to be created specifically https://github.com/kube-rs/kube-rs/issues/196
    })
    .await?;

    let client = Client::try_from(config)?;
    // let client = Client::try_default().await?; // This should work in the cluster

    let pods: Api<Pod> = Api::all(client);
    let lp = ListParams::default();

    for p in pods.list(&lp).await? {
        println!("Found Pod: {}", p.name());
    }

    Ok(Json(Message { id: Some(4) }))
}
