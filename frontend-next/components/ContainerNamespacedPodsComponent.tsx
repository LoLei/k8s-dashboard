import React, { useEffect, useState } from 'react';

import {
  ApiResponsePods,
  NamespacedPods,
  PodResource,
  Node,
  ApiResponseNodes,
} from '../util/types';

import NamespacesComponent from './NamespacesComponent';
import PodsComponent from './PodsComponent';
import PodDetailsComponent from './PodDetailsComponent';
import NodeDetailsComponent from './NodeDetailsComponent';

const ContainerNamespacedPodsComponent = (): JSX.Element => {
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
    <>
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
      />
    </>
  );
};

export default ContainerNamespacedPodsComponent;
