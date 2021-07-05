import express, { Application, Request, Response } from 'express';
import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const app: Application = express();
const port = 3000;

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello World!',
  });
});

app.get('/api/k8s/pods', async (req: Request, res: Response): Promise<Response> => {
  const k8sRes = await k8sApi.listPodForAllNamespaces();

  const namespacedPods: NamespacedPods = {};
  k8sRes.body.items.forEach((v1p) => {
    const pod = {
      name: v1p.metadata?.name,
      namespace: v1p.metadata?.namespace,
      nodeName: v1p.spec?.nodeName,
      phase: v1p.status?.phase,
      startTime: v1p.status?.startTime,
    };

    if (pod.namespace != null) {
      const podList = namespacedPods[pod.namespace] || [];
      podList.push(pod);
      namespacedPods[pod.namespace] = podList;
    }
  });

  return res.status(200).send({
    items: namespacedPods,
  });
});

try {
  app.listen(port, (): void => {
    console.log(`Listening on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}

type NamespacedPods = Record<string, PodResource[]>;

interface PodResource {
  name?: string;
  namespace?: string;
  nodeName?: string;
  phase?: string;
  startTime?: Date;
}
