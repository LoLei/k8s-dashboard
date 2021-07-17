import { ApiResponseNodes, ApiResponsePods } from '../util/types';
import IClusterApi from './IClusterApi';

class ClusterApi implements IClusterApi {
  public static _instance: ClusterApi;
  private backendUrl: string;
  private backendPort: string;

  private constructor() {
    this.backendUrl = process.env.CLUSTER_API_BACKEND_URL || 'http://localhost';
    this.backendPort = process.env.CLUSTER_API_BACKEND_PORT || '4000';
  }

  public static get Instance(): ClusterApi {
    return this._instance || (this._instance = new this());
  }

  public async pods(): Promise<ApiResponsePods> {
    const url = `${this.backendUrl}:${this.backendPort}/api/k8s/pods`;
    console.log(`Fetching backend response from ${url}`);
    const res = await fetch(url);
    const json = await res.json();
    return json as ApiResponsePods;
  }

  public async nodes(): Promise<ApiResponseNodes> {
    const url = `${this.backendUrl}:${this.backendPort}/api/k8s/nodes`;
    console.log(`Fetching backend response from ${url}`);
    const res = await fetch(url);
    const json = await res.json();
    return json as ApiResponseNodes;
  }
}

export default ClusterApi;
