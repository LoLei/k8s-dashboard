use std::convert::TryInto;
use std::convert::TryFrom;

use k8s_openapi::{
    api::core::v1::{Node, Pod},
    apimachinery::pkg::api::resource::Quantity,
};
use kube::{api::ListParams, Api, Client};

use crate::types::ResourceStatus;

pub async fn pods_for_node(client: &Client, node: &Node) -> Result<Vec<Pod>, anyhow::Error> {
    let pods: Api<Pod> = Api::all(client.to_owned());
    let lp = ListParams::default();

    let filtered_pods = pods
        .list(&lp)
        .await?
        .into_iter()
        .filter(|p| {
            match p.spec.clone() {
                Some(x) => x,
                None => return false,
            }
            .node_name
                == node.metadata.name
        })
        .collect::<Vec<Pod>>();

    Ok(filtered_pods)
}

pub fn cpu_for_pod(pod: &Pod) -> ResourceStatus {
    resource_for_pod(pod, "cpu")
}

pub fn memory_for_pod(pod: &Pod) -> ResourceStatus {
    resource_for_pod(pod, "memory")
}

fn resource_for_pod(pod: &Pod, resource: &str) -> ResourceStatus {
    // let req_total: i64 = Quantity("0".into()).try_into().unwrap();
    // let req_total: i64 = i64::try_from(Quantity("0".into())).unwrap();
    let limit_total = 0;

    let x = i64::from(false);
    let int: i32 = "100m".parse().unwrap();

    // TODO: Avoid ITM
    // TODO: Remove unwrap
    // TODO: Re-implement quantityToScalar: https://github.com/kubernetes-client/javascript/blob/6b713dc83f494e03845fca194b84e6bfbd86f31c/src/util.ts#L17
    /*pod.spec.unwrap().containers.iter().for_each(|c| {
        req_total = req_total
            + c.resources
                .unwrap()
                .requests
                .get(resource)
                .unwrap()
                .to_owned();
    });*/

    // TODO
    ResourceStatus {
        request: 0,
        limit: 0,
        resourceType: resource.into(),
    }
}
