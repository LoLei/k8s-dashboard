import React from 'react';
import ContainerNamespacedPodsComponent from '../components/ContainerNamespacedPodsComponent';

export default function Home(): JSX.Element {
  return (
    <div className="App">
      <div className="container-namespaced-pods">
        <ContainerNamespacedPodsComponent />
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
