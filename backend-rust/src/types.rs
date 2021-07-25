use std::collections::HashMap;

use k8s_openapi::apimachinery::pkg::apis::meta::v1::Time;
use kube::Client;
use rocket::serde::{Deserialize, Serialize};

pub struct KubeClient {
    pub client: Client,
}

pub type NamespacedPods = HashMap<String, Vec<PodResource>>;

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct PodResource {
    pub name: String,
    pub namespace: String,
    pub nodeName: Option<String>,
    pub spec: Spec,
    pub status: Status,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Spec {
    pub containerImages: Vec<Option<String>>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Status {
    pub phase: Option<String>,
    pub startTime: Option<Time>,
    pub restartCount: i32,
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
    pub capacity: u32, // TODO: These should be string number union
    pub requestTotal: u32,
    pub limitTotal: u32,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct ResourceStatus {
    pub request: u32,
    pub limit: u32,
    pub resourceType: String,
}
