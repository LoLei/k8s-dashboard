use std::convert::TryFrom;
use std::convert::TryInto;

use k8s_openapi::{
    api::core::v1::{Node, Pod},
    apimachinery::pkg::api::resource::Quantity,
};
use kube::{api::ListParams, Api, Client};

use crate::types::NodeResource;
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
    let mut request_total = 0;
    let mut limit_total = 0;
    let spec = pod.spec.clone().unwrap();

    for c in &spec.containers {
        println!("{:?}", c.resources);
    }

    // TODO: Avoid ITM
    // TODO: Remove unwraps
    spec.containers.iter().for_each(|c| {
        request_total = request_total
            + quantity_to_scalar(c.resources.clone().unwrap().requests.get(resource).unwrap());
    });

    spec.containers.iter().for_each(|c| {
        limit_total = limit_total
            + quantity_to_scalar(c.resources.clone().unwrap().limits.get(resource).unwrap());
    });

    ResourceStatus {
        request: request_total.try_into().unwrap_or(0),
        limit: limit_total.try_into().unwrap_or(0),
        resourceType: resource.into(),
    }
}

/// Same functionality as quantityToScalar in the Javascript API client
/// https://github.com/kubernetes-client/javascript/blob/6b713dc83f494e03845fca194b84e6bfbd86f31c/src/util.ts#L17
fn quantity_to_scalar(q: &Quantity) -> u64 {
    // bytfmt uses Mib etc instead of Mi etc
    let bytes: u64 = bytefmt::parse(q.0.to_owned().replace("i", "ib")).unwrap();
    dbg!(bytes);
    bytes
}

pub async fn cpu_for_node(client: &Client, node: &Node) -> NodeResource {
    resource_for_node(client, node, "cpu").await
}

pub async fn memory_for_node(client: &Client, node: &Node) -> NodeResource {
    resource_for_node(client, node, "memory").await
}

async fn resource_for_node(client: &Client, node: &Node, resource: &str) -> NodeResource {
    let pods = pods_for_node(client, node).await.unwrap();
    let mut total_pod_request = 0;
    let mut total_pod_limit = 0;

    // TODO: Avoid ITM
    for p in pods {
        let resource = resource_for_pod(&p, resource);
        total_pod_request += resource.request;
        total_pod_limit += resource.limit;
    }

    // TODO: Return result instead of the unwraps
    NodeResource {
        capacity: quantity_to_scalar(
            node.status
                .clone()
                .unwrap()
                .allocatable
                .get(resource)
                .unwrap(),
        )
        .try_into()
        .unwrap_or(0),
        requestTotal: total_pod_request,
        limitTotal: total_pod_limit,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use k8s_openapi::apimachinery::pkg::api::resource::Quantity;

    #[test]
    fn test_quantity_to_scalar_mb() {
        let quantity = Quantity("1574Mi".into());
        let scalar = quantity_to_scalar(&quantity);
        assert_eq!(scalar, 1_650_458_624)
    }

    #[test]
    fn test_quantity_to_scalar_gb() {
        let quantity = Quantity("1.5Gi".into());
        let scalar = quantity_to_scalar(&quantity);
        assert_eq!(scalar, 1_610_612_736)
    }
}