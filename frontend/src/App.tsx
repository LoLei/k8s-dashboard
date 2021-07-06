import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App(): JSX.Element {
  const [namespacedPods, setNamespacedPods] = useState<NamespacedPods>({});

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
        {Object.keys(namespacedPods).map((k, idx) => {
          return <div key={idx}>{k}</div>;
        })}
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
