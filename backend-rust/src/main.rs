#[macro_use]
extern crate rocket;
use k8s_openapi::api::core::v1::Pod;
use kube::api::ListParams;
use kube::config::KubeConfigOptions;
use kube::{Api, Client};
use kube::{Config, ResourceExt};
use rocket::http::Status;
use std::convert::TryFrom;

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
    // TODO: Move this into rocket initialization or somewhere else so it's not done for each request
    // This should not be necessary in the cluster
    let config = Config::from_kubeconfig(&KubeConfigOptions {
        cluster: None,
        context: None,
        user: Some(String::from("rust")), // This user had to be created specifically https://github.com/kube-rs/kube-rs/issues/196
    })
    .await
    .unwrap();

    let client = Client::try_from(config).map_err(|_| Status::InternalServerError)?;
    // let client = Client::try_default().await.map_err(|_| Status::InternalServerError)?; // This should work in the cluster

    let pods: Api<Pod> = Api::all(client);
    let lp = ListParams::default();

    for p in pods
        .list(&lp)
        .await
        .map_err(|_| Status::InternalServerError)?
    {
        println!("Found Pod: {}", p.name());
    }

    // for p in match pods.list(&lp).await {
    //     Ok(p) => p,
    //     Err(e) => {
    //         println!("{}", e);
    //         return Err(Status::InternalServerError);
    //     }
    // } {
    //     println!("Found Pod: {}", p.name());
    // }

    Ok(Json(Message { id: Some(4) }))
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}
