import React, { useEffect, useState } from 'react';
import './App.scss';

function App(): JSX.Element {
  const [namespacedPods, setNamespacedPods] = useState<NamespacedPods>({});
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [selectedPod, setSelectedPod] = useState<PodResource | undefined>(undefined);

  const callApi = async (): Promise<ApiResponse> => {
    // TODO: Do not use localhost and hardcoded port
    const res = await fetch('http://localhost:4000/api/k8s/pods');
    const json = await res.json();
    console.log(json);
    return json as ApiResponse;
  };

  useEffect(() => {
    callApi().then((nsp) => setNamespacedPods(nsp.items));
  }, []);

  return (
    <div className="App">
      <main className="App-main">
        <div className="namespaces">
          <h3>Namespaces:</h3>
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

        <div className="pods">
          {selectedNamespace !== '' && <h3>Pods:</h3>}
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
        <div className="pod-details">
          {selectedPod != null && <h3>Pod Details:</h3>}
          {selectedNamespace !== '' && <div>{selectedPod?.name}</div>}
        </div>
      </main>
    </div>
  );
}

export default App;

interface ApiResponse {
  items: NamespacedPods;
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
