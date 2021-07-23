use k8s_openapi::api::core::v1::{Node, Pod};

pub fn pods_for_node(n: Node) -> Vec<Pod> {
    vec![]
}
