use std::collections::HashMap;

use rocket::serde::{Deserialize, Serialize};

pub type NamespacedPods = HashMap<String, Vec<PodResource>>;

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct PodResource {
    pub name: String,
    pub namespace: String,
    pub nodeName: String,
    pub spec: Spec,
    pub status: Status,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Spec {
    pub containerImages: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Status {
    pub phase: String,
    pub startTime: String,
    pub restartCount: usize,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Node {
    pub name: String,
    pub status: NodeStatus,
    pub cpu: NodeResource,
    pub memory: NodeResource,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NodeStatus {
    pub nodeInfo: NodeInfo,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NodeInfo {
    pub architecture: String,
    pub containerRuntimeVersion: String,
    pub kernelVersion: String,
    pub kubeletVersion: String,
    pub operatingSystem: String,
    pub osImage: String,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NodeResource {
    pub capacity: String, // TODO: These should be string number union
    pub requestTotal: String,
    pub limitTotal: String,
}
