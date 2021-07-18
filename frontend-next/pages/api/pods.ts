import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponsePods } from '../../util/types';
import ClusterApi from '../../cluster_api/ClusterApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponsePods>
): Promise<void> {
  console.log(`Got request for pods from ${req.socket.remoteAddress}`);
  const clusterApi = ClusterApi.Instance;
  const backendRes = await clusterApi.pods();
  res.status(200).json(backendRes);
}
