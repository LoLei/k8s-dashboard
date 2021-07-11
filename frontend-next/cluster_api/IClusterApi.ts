import { ApiResponseNodes, ApiResponsePods } from '../util/types';

interface IClusterApi {
  pods: () => Promise<ApiResponsePods>;
  nodes: () => Promise<ApiResponseNodes>;
}

export default IClusterApi;
