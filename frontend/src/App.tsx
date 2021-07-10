import React, { useEffect, useState } from 'react';
import { ApiResponsePods, NamespacedPods, PodResource, Node, ApiResponseNodes } from './types';
import './App.scss';
import prettyMilliseconds from 'pretty-ms';
import ObjectComponent from './ObjectComponent';
import NamespacesComponent from './NamespacesComponent';
import PodsComponent from './PodsComponent';

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

  const getAgeInHours = (d: Date | undefined): string => {
    if (d == null) {
      return '?';
    }
    const diffMs = new Date().getTime() - new Date(d).getTime();
    return prettyMilliseconds(diffMs, { compact: true });
  };

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

        {selectedPod != null && <h3>Pod Details:</h3>}
        <div className="pod-details">
          {selectedPod != null && (
            <>
              <div>
                <b>Name:</b> {selectedPod?.name}
              </div>
              <div
                className={selectedPod?.nodeName === selectedNode?.name ? 'node-selected' : 'node'}
                onClick={() => setSelectedNode(nodes.find((n) => n.name === selectedPod?.nodeName))}
              >
                <b>Node:</b> {selectedPod?.nodeName}
              </div>
              <div>
                <b>Containers:</b>
                <ul>
                  {selectedPod?.spec.containerImages?.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <b>Phase:</b>{' '}
                <span
                  className={
                    selectedPod?.status.phase === 'Running'
                      ? 'pod-status-phase-running'
                      : 'pod-status-phase-other'
                  }
                >
                  {selectedPod?.status.phase}
                </span>
              </div>
              <div>
                <b>Age:</b> {getAgeInHours(selectedPod?.status.startTime)}
              </div>
              <div>
                <b>Restarts:</b> {selectedPod?.status.restartCount}
              </div>
            </>
          )}
        </div>

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
