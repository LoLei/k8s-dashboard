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
    const res = await fetch('/api/pods');
    const json = await res.json();
    console.log(json);
    return json as ApiResponsePods;
  };

  const getNodesFromApi = async (): Promise<ApiResponseNodes> => {
    const res = await fetch('/api/nodes');
    const json = await res.json();
    console.log(json);
    return json as ApiResponseNodes;
  };

  useEffect(() => {
    getPodsFromApi().then((r) => setNamespacedPods(r.items));
    getNodesFromApi().then((r) => setNodes(r.nodes));
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
      <footer>
        <a href="https://github.com/LoLei/k8s-dashboard" target="_blank" rel="noreferrer">
          Source
        </a>
      </footer>
    </div>
  );
}
