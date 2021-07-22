pub mod types;

use anyhow::Context;
use k8s_openapi::api::core::v1::Pod;
use kube::api::ListParams;
use kube::config::KubeConfigOptions;
use kube::{Api, Client};
use kube::{Config, ResourceExt};
use rocket::http::Status;
use std::convert::TryFrom;
use types::NamespacedPods;
use types::PodResource;
use types::Spec;

pub async fn pods() -> Result<NamespacedPods, anyhow::Error> {
    // TODO: Move this into rocket initialization or somewhere else so it's not done for each request
    // This should not be necessary in the cluster
    let config = Config::from_kubeconfig(&KubeConfigOptions {
        cluster: None,
        context: None,
        user: Some(String::from("rust")), // This user had to be created specifically https://github.com/kube-rs/kube-rs/issues/196
    })
    .await
    .context(Status::ImATeapot)?; // For demonstration, this status would also be returned in the route if this fails

    let client = Client::try_from(config)?;
    // let client = Client::try_default().await?; // This should work in the cluster

    let pods: Api<Pod> = Api::all(client);
    let lp = ListParams::default();

    // TODO: Avoid ITM
    let mut namespaced_pods = NamespacedPods::new();

    for p in pods.list(&lp).await? {
        println!("Found Pod: {}", p.name());
        let ns = match p.namespace() {
            Some(x) => x,
            None => continue,
        };
        let pod_resource = PodResource {
            name: p.name(),
            namespace: String::from(&ns),
            nodeName: "".into(), // TODO
            spec: Spec {
                containerImages: vec![], // TODO
            },
            status: types::Status {
                phase: "".into(),     // TODO
                startTime: "".into(), // TODO
                restartCount: 0,      // TODO
            },
        };
        let l = namespaced_pods
            .entry(ns)
            .or_insert(Vec::<PodResource>::new());
        l.push(pod_resource);
    }

    Ok(namespaced_pods)
}
