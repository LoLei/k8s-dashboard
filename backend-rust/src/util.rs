use k8s_openapi::api::core::v1::{Node, Pod};
use kube::{api::ListParams, Api, Client};

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
