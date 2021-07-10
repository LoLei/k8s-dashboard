import React, { useEffect, useState } from 'react';
import { ApiResponsePods, NamespacedPods, PodResource, Node, ApiResponseNodes } from './types';
import './App.scss';
import ObjectComponent from './ObjectComponent';
import NamespacesComponent from './NamespacesComponent';
import PodsComponent from './PodsComponent';
import PodDetailsComponent from './PodDetailsComponent';

function App(): JSX.Element {
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

        {selectedNode != null && <h3>Node Details:</h3>}
        {selectedNode != null && (
          <div className="node-details">
            <div>
              <b>Name:</b> {selectedNode?.name}
            </div>
            <ObjectComponent title="Status" objectToDisplay={selectedNode?.status.nodeInfo} />
            <ObjectComponent title="CPU" objectToDisplay={selectedNode?.cpu} />
            <ObjectComponent title="Memory" objectToDisplay={selectedNode?.memory} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
