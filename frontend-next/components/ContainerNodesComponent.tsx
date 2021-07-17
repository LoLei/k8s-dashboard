import React, { useEffect, useState } from 'react';

import { Node, ApiResponseNodes } from '../util/types';

import NodesComponent from './NodesComponent';
import NodeDetailsComponent from './NodeDetailsComponent';

const ContainerNodesComponent = (): JSX.Element => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

  const getNodesFromApi = async (): Promise<ApiResponseNodes> => {
    const res = await fetch('/api/nodes');
    const json = await res.json();
    console.log(json);
    return json as ApiResponseNodes;
  };

  useEffect(() => {
    getNodesFromApi().then((r) => setNodes(r.nodes));
  }, []);

  return (
    <>
      <NodesComponent nodes={nodes} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />

      <NodeDetailsComponent selectedNode={selectedNode} />
    </>
  );
};

export default ContainerNodesComponent;
