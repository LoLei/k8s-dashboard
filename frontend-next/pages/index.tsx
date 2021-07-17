import React from 'react';
import ContainerNamespacedPodsComponent from '../components/ContainerNamespacedPodsComponent';
import ContainerNodesComponent from '../components/ContainerNodesComponent';

export default function Home(): JSX.Element {
  return (
    <div className="App">
      <div className="content-container">
        <div className="container-namespaced-pods">
          <ContainerNamespacedPodsComponent />
        </div>

        <div className="container-nodes">
          <ContainerNodesComponent />
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
