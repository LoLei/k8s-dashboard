import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const [pods, setPods] = useState<string[]>([]);

  const callApi = async (): Promise<void> => {
    // TODO: Do not use localhost and hardcoded port
    const res = await fetch('http://localhost:4000/api/k8s/pods');
    const json = await res.json();
    console.log(json);
  };


  useEffect(() => {
    callApi();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>

        <div>foobar</div>
      </header>
    </div>
  );
}

export default App;

type NamespacedPods = Record<string, PodResource[]>;

interface PodResource {
  name?: string;
  namespace?: string;
  nodeName?: string;
  phase?: string;
  startTime?: Date;
}
