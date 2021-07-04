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

app.get('/k8s', async (req: Request, res: Response): Promise<Response> => {
  const k8sRes = await k8sApi.listNamespacedPod('default');
  console.log(k8sRes.body);

  return res.status(200).send({
    message: 'Hello k8s!',
  });
});

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
