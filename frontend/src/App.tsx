import React, { useEffect, useState } from 'react';
import { ApiResponsePods, NamespacedPods, PodResource, Node, ApiResponseNodes } from './types';
import './App.scss';

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
        <h3>Namespaces:</h3>
        <div className="namespaces">
          {Object.keys(namespacedPods).map((ns, idx) => {
            return (
              <div
                key={idx}
                className={ns === selectedNamespace ? 'namespace-selected' : 'namespace'}
                onClick={() => setSelectedNamespace(ns)}
              >
                {ns}
              </div>
            );
          })}
        </div>

        {selectedNamespace !== '' && <h3>Pods:</h3>}
        <div className="pods">
          {selectedNamespace !== '' &&
            namespacedPods[selectedNamespace].map((pod, idx) => {
              return (
                <div
                  key={idx}
                  className={pod === selectedPod ? 'pod-selected' : 'pod'}
                  onClick={() => setSelectedPod(pod)}
                >
                  {pod.name}
                </div>
              );
            })}
        </div>

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
                <b>Start Time:</b> {selectedPod?.status.startTime}
              </div>
              <div>
                <b>Restarts:</b> {selectedPod?.status.restartCount}
              </div>
            </>
          )}
        </div>

        {selectedNode != null && <h3>Node Details:</h3>}
        {selectedNode != null && <div className="node-details">Name: {selectedNode?.name}</div>}
      </main>
    </div>
  );
}

export default App;
