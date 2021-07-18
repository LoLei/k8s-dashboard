import React, { useEffect, useState } from 'react';
import { ApiResponseNodes, ApiResponsePods, NamespacedPods, Node } from '../util/types';
import ContainerNamespacedPodsComponent from '../components/ContainerNamespacedPodsComponent';
import ContainerNodesComponent from '../components/ContainerNodesComponent';
import { BiRefresh } from 'react-icons/bi';

export default function Home(): JSX.Element {
  const [namespacedPods, setNamespacedPods] = useState<NamespacedPods>({});
  const [nodes, setNodes] = useState<Node[]>([]);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>(undefined);
  const refreshRateSeconds = parseInt(process.env.NEXT_PUBLIC_REFRESH_RATE_SECONDS || '30');

  useEffect(() => {
    callApi();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      autoRefreshLoop();
    } else if (intervalId != null) {
      clearInterval(intervalId);
    }
  }, [autoRefresh]);

  const getPodsFromApi = async (): Promise<ApiResponsePods> => {
    const res = await fetch('/api/pods');
    const json = await res.json();
    return json as ApiResponsePods;
  };

  const getNodesFromApi = async (): Promise<ApiResponseNodes> => {
    const res = await fetch('/api/nodes');
    const json = await res.json();
    return json as ApiResponseNodes;
  };

  const callApi = async (): Promise<void> => {
    const [responsePods, responseNodes] = await Promise.all([getPodsFromApi(), getNodesFromApi()]);

    setNamespacedPods(responsePods.items);
    setNodes(responseNodes.nodes);

    setLastUpdated(new Date());
  };

  const autoRefreshLoop = () => {
    callApi();
    const id = setInterval(() => {
      callApi();
    }, refreshRateSeconds * 1000);
    setIntervalId(id);
  };

  const handleRefreshButtonClicked = () => {
    callApi();
  };

  const handleRefreshCheckClicked = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="App">
      <div className="refresh-container">
        <button onClick={handleRefreshButtonClicked} disabled={autoRefresh}>
          <BiRefresh />
        </button>
        {' | '}
        <input type="checkbox" onClick={handleRefreshCheckClicked} checked={autoRefresh} />
        <span title={`${refreshRateSeconds}s`}>Auto refresh</span>
        {' | '}
        <span title="Last updated">
          Last:{' '}
          {lastUpdated.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
      </div>

      <div className="content-container">
        <div className="container-namespaced-pods">
          <ContainerNamespacedPodsComponent namespacedPods={namespacedPods} />
        </div>

        <div className="container-nodes">
          <ContainerNodesComponent nodes={nodes} />
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
