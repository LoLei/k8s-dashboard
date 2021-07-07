import express, { Application, Request, Response } from 'express';
import * as k8s from '@kubernetes/client-node';
import cors from 'cors';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const app: Application = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET'],
  })
);
// TODO: Do not hardcode port
const port = 4000;

app.get('/api/k8s/topNodes', async (req: Request, res: Response): Promise<Response> => {
  console.log(`Got request for pods on ${req.hostname} from ${req.ip}`);

  const k8sRes = await k8s.topNodes(k8sApi);

  // Replace bigints to fix TypeError: Do not know how to serialize a BigInt
  const str = JSON.stringify(k8sRes, (_, v) => (typeof v === 'bigint' ? v.toString() : v));

  return res.status(200).send({
    topNodes: JSON.parse(str),
  });
});

app.get('/api/k8s/pods:full?', async (req: Request, res: Response): Promise<Response> => {
  console.log(`Got request for pods on ${req.hostname} from ${req.ip}`);

  const k8sRes = await k8sApi.listPodForAllNamespaces();

  // Used mostly for debug purposes, get the full API response rather than the selected one below
  if (req.query.full) {
    return res.status(200).send({
      items: k8sRes.body.items,
    });
  }

  const namespacedPods: NamespacedPods = {};
  k8sRes.body.items.forEach((v1p) => {
    const pod = {
      name: v1p.metadata?.name,
      namespace: v1p.metadata?.namespace,
      nodeName: v1p.spec?.nodeName,
      spec: { containerImages: v1p.spec?.containers.map((it) => it.image) },
      status: {
        phase: v1p.status?.phase,
        startTime: v1p.status?.startTime,
        restartCount: v1p.status?.containerStatuses?.reduce(
          (acc, it) => (acc += it.restartCount),
          0
        ),
      },
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
  spec: Spec;
  status: Status;
}

interface Spec {
  containerImages?: (string | undefined)[];
}

interface Status {
  phase?: string;
  startTime?: Date;
  restartCount?: number;
}
