import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponseNodes } from '../../util/types';
import ClusterApi from '../../cluster_api/ClusterApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseNodes>
): Promise<void> {
  const clusterApi = ClusterApi.Instance;
  const backendRes = await clusterApi.nodes();
  res.status(200).json(backendRes);
}
