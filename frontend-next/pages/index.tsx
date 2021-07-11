import React, { useEffect, useState } from 'react';
import {
  ApiResponsePods,
  NamespacedPods,
  PodResource,
  Node,
  ApiResponseNodes,
} from '../util/types';
import NamespacesComponent from '../components/NamespacesComponent';
import PodsComponent from '../components/PodsComponent';
import PodDetailsComponent from '../components/PodDetailsComponent';
import NodeDetailsComponent from '../components/NodeDetailsComponent';

export default function Home(): JSX.Element {
  const [namespacedPods, setNamespacedPods] = useState<NamespacedPods>({});
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [selectedPod, setSelectedPod] = useState<PodResource | undefined>(undefined);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);
  const [nodes, setNodes] = useState<Node[]>([]);

  const getPodsFromApi = async (): Promise<ApiResponsePods> => {
    // TODO: Do not use localhost and hardcoded port
    const res = await fetch('http://localhost:4000/api/k8s/pods');
    const json = await res.json();
    console.log(json);
    return json as ApiResponsePods;
  };

  const getNodesFromApi = async (): Promise<ApiResponseNodes> => {
    // TODO: Do not use localhost and hardcoded port
    const res = await fetch('http://localhost:4000/api/k8s/topNodes');
    const json = await res.json();
    console.log(json);
    return json as ApiResponseNodes;
  };

  useEffect(() => {
    getPodsFromApi().then((r) => setNamespacedPods(r.items));
    getNodesFromApi().then((r) => setNodes(r.topNodes));
  }, []);

  return (
    <div className="App">
      <main className="App-main">
        <NamespacesComponent
          namespacedPods={namespacedPods}
          selectedNamespace={selectedNamespace}
          setSelectedNamespace={setSelectedNamespace}
        />

        <PodsComponent
          namespacedPods={namespacedPods}
          selectedNamespace={selectedNamespace}
          selectedPod={selectedPod}
          setSelectedPod={setSelectedPod}
        />

        <PodDetailsComponent
          selectedPod={selectedPod}
          selectedNode={selectedNode}
          nodes={nodes}
          setSelectedNode={setSelectedNode}
        />

        <NodeDetailsComponent selectedNode={selectedNode} />
      </main>
    </div>
  );
}
