import React, { useEffect, useState } from 'react';
import { ApiResponseNodes, ApiResponsePods, NamespacedPods, Node } from '../util/types';
import ContainerNamespacedPodsComponent from '../components/ContainerNamespacedPodsComponent';
import ContainerNodesComponent from '../components/ContainerNodesComponent';

export default function Home(): JSX.Element {
  const [namespacedPods, setNamespacedPods] = useState<NamespacedPods>({});
  const [nodes, setNodes] = useState<Node[]>([]);

  const getPodsFromApi = async (): Promise<ApiResponsePods> => {
    const res = await fetch('/api/pods');
    const json = await res.json();
    return json as ApiResponsePods;
  };

  const getNodesFromApi = async (): Promise<ApiResponseNodes> => {
    const res = await fetch('/api/nodes');
    const json = await res.json();
    return json as ApiResponseNodes;
  };

  useEffect(() => {
    getPodsFromApi().then((r) => setNamespacedPods(r.items));
    getNodesFromApi().then((r) => setNodes(r.nodes));
  }, []);

  return (
    <div className="App">
      <div className="content-container">
        <div className="container-namespaced-pods">
          <ContainerNamespacedPodsComponent namespacedPods={namespacedPods} />
        </div>

        <div className="container-nodes">
          <ContainerNodesComponent nodes={nodes} />
        </div>
      </div>

      <footer>
        <a href="https://lolei.dev" target="_blank" rel="noreferrer">
          Home
        </a>
        {' | '}
        <a href="https://github.com/LoLei/k8s-dashboard" target="_blank" rel="noreferrer">
          Source
        </a>
      </footer>
    </div>
  );
}
