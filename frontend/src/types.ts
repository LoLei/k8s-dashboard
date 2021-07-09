export interface ApiResponsePods {
  items: NamespacedPods;
}

export type NamespacedPods = Record<string, PodResource[]>;

export interface PodResource {
  name?: string;
  namespace?: string;
  nodeName?: string;
  spec: Spec;
  status: Status;
}

export interface Spec {
  containerImages?: (string | undefined)[];
}

export interface Status {
  phase?: string;
  startTime?: Date;
  restartCount?: number;
}

export interface ApiResponseNodes {
  topNodes: Node[];
}

export interface Node {
  name: string;
  status: NodeStatus;
  cpu: NodeResource;
  memory: NodeResource;
}

export interface NodeStatus {
  nodeInfo: NodeInfo;
}

export interface NodeInfo {
  architecture: string;
  containerRuntimeVersion: string;
  kernelVersion: string;
  kubeletVersion: string;
  operatingSystem: string;
  osImage: string;
}

export interface NodeResource {
  capacity: string | number;
  requestTotal: string | number;
  limitTotal: string | number;
}
