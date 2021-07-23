pub mod types;
mod util;

use k8s_openapi::api::core::v1::{Node, Pod};
use kube::api::ListParams;
use kube::Api;
use kube::Client;
use kube::ResourceExt;
use types::NodeStatus;
use types::PodResource;
use types::Spec;
use types::{KubeClient, NamespacedPods};

use crate::types::{NodeInfo, NodeResource};

pub async fn pods(client: &Client) -> Result<NamespacedPods, anyhow::Error> {
    let pods: Api<Pod> = Api::all(client.to_owned());
    let lp = ListParams::default();

    // TODO: Avoid ITM
    let mut namespaced_pods = NamespacedPods::new();

    for p in pods.list(&lp).await? {
        let ns = match p.namespace() {
            Some(x) => x,
            None => continue,
        };
        let spec = match p.spec.clone() {
            Some(x) => x,
            None => continue,
        };
        let status = match p.status.clone() {
            Some(x) => x,
            None => continue,
        };
        let pod_resource = PodResource {
            name: p.name(),
            namespace: String::from(&ns),
            nodeName: spec.node_name,
            spec: Spec {
                containerImages: spec.containers.iter().map(|it| it.image.clone()).collect(),
            },
            status: types::Status {
                phase: status.phase,
                startTime: status.start_time,
                restartCount: status
                    .container_statuses
                    .iter()
                    .fold(0, |acc, it| acc + it.restart_count),
            },
        };
        let l = namespaced_pods
            .entry(ns)
            .or_insert(Vec::<PodResource>::new());
        l.push(pod_resource);
    }

    Ok(namespaced_pods)
}

pub async fn nodes(client: &Client) -> Result<Vec<types::Node>, anyhow::Error> {
    let nodes: Api<Node> = Api::all(client.to_owned());
    let lp = ListParams::default();

    // TODO: Avoid ITM
    let mut res_nodes = Vec::<types::Node>::new();

    for n in nodes.list(&lp).await? {
        let status = match n.status.clone() {
            Some(x) => x,
            None => continue,
        };
        let node_info = match status.node_info.clone() {
            Some(x) => x,
            None => continue,
        };
        res_nodes.push(types::Node {
            name: n.name(),
            status: NodeStatus {
                nodeInfo: NodeInfo {
                    architecture: node_info.architecture,
                    containerRuntimeVersion: node_info.container_runtime_version,
                    kernelVersion: node_info.kernel_version,
                    kubeletVersion: node_info.kubelet_version,
                    operatingSystem: node_info.operating_system,
                    osImage: node_info.os_image,
                },
            },
            cpu: NodeResource {
                // TODO
                capacity: "".into(),
                requestTotal: "".into(),
                limitTotal: "".into(),
            },
            memory: NodeResource {
                // TODO
                capacity: "".into(),
                requestTotal: "".into(),
                limitTotal: "".into(),
            },
        });
    }

    Ok(res_nodes)
}
